import { auth } from "@clerk/nextjs/server";
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { isBlobConfigured, isClerkConfigured } from "@/lib/config";

export async function POST(request: Request) {
  if (!isClerkConfigured || !isBlobConfigured) {
    return Response.json({ error: "Storage is not configured." }, { status: 503 });
  }

  const { userId } = await auth();
  if (!userId) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const body = (await request.json()) as HandleUploadBody;

  try {
    const response = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname) => {
        if (!pathname.startsWith(`${userId}/`) || pathname.slice(userId.length + 1).includes("/")) {
          throw new Error("Invalid upload path.");
        }
        return {
          allowedContentTypes: undefined,
          addRandomSuffix: true,
          maximumSizeInBytes: 2 * 1024 * 1024 * 1024,
          tokenPayload: JSON.stringify({ userId }),
        };
      },
      onUploadCompleted: async () => {},
    });
    return Response.json(response);
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Upload failed" }, { status: 400 });
  }
}

