import { auth } from "@clerk/nextjs/server";
import { del } from "@vercel/blob";
import { isBlobConfigured, isClerkConfigured } from "@/lib/config";

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

