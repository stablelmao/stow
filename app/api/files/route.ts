import { auth } from "@clerk/nextjs/server";
import { del, list } from "@vercel/blob";
import { isBlobConfigured, isClerkConfigured } from "@/lib/config";
import { createShareId } from "@/lib/share";

export async function GET() {
  if (!isClerkConfigured || !isBlobConfigured) return Response.json({ error: "Not configured" }, { status: 503 });
  const { userId } = await auth();
  if (!userId) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const result = await list({ prefix: `${userId}/`, limit: 100 });
  return Response.json({
    files: result.blobs.map((blob) => ({
      url: blob.url,
      shareUrl: `/f/${createShareId(blob.pathname)}`,
      pathname: blob.pathname,
      size: blob.size,
      uploadedAt: new Intl.DateTimeFormat("en", { month: "short", day: "numeric" }).format(blob.uploadedAt),
    })),
  });
}

export async function DELETE(request: Request) {
  if (!isClerkConfigured || !isBlobConfigured) return Response.json({ error: "Not configured" }, { status: 503 });
  const { userId } = await auth();
  if (!userId) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const url = new URL(request.url).searchParams.get("url");
  if (!url) return Response.json({ error: "Missing URL" }, { status: 400 });

  const blobUrl = new URL(url);
  if (!blobUrl.hostname.endsWith(".public.blob.vercel-storage.com")) {
    return Response.json({ error: "Invalid blob URL" }, { status: 400 });
  }
  const pathname = blobUrl.pathname.replace(/^\//, "");
  if (!pathname.startsWith(`${userId}/`)) return Response.json({ error: "Forbidden" }, { status: 403 });

  await del(url);
  return Response.json({ ok: true });
}

