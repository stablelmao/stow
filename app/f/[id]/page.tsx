import type { Metadata } from "next";
import { head } from "@vercel/blob";
import { ArrowSquareOut, File } from "@phosphor-icons/react/dist/ssr";
import { notFound } from "next/navigation";
import { cache } from "react";
import { displayFileName, formatFileSize, readShareId } from "@/lib/share";

type SharePageProps = { params: Promise<{ id: string }> };

const getSharedFile = cache(async (id: string) => {
  try {
    return await head(readShareId(id));
  } catch {
    return null;
  }
});

export async function generateMetadata({ params }: SharePageProps): Promise<Metadata> {
  const { id } = await params;
  const blob = await getSharedFile(id);
  if (!blob) return { title: "File not found — Stow" };
  const name = displayFileName(blob.pathname);
  const description = `${formatFileSize(blob.size)} ${blob.contentType || "file"} shared with Stow.`;
  return {
    title: `${name} — Stow`,
    description,
    openGraph: { title: name, description, siteName: "Stow", type: "website" },
    twitter: { card: "summary_large_image", title: name, description },
  };
}

export default async function SharePage({ params }: SharePageProps) {
  const { id } = await params;
  const blob = await getSharedFile(id);
  if (!blob) notFound();
  const name = displayFileName(blob.pathname);
  const isImage = blob.contentType.startsWith("image/");

  return (
    <main className="share-page">
      <article className="share-card">
        <div className="share-preview">
          {/* Blob URLs are already CDN-optimized and retain the uploaded file unchanged. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          {isImage ? <img src={blob.url} alt={`Preview of ${name}`} /> : <File size={82} weight="duotone" />}
        </div>
        <div className="share-copy">
          <span>SHARED WITH STOW</span>
          <h1>{name}</h1>
          <p>{formatFileSize(blob.size)} · {blob.contentType || "File"}</p>
          <a href={blob.downloadUrl}>Download file <ArrowSquareOut size={17} /></a>
        </div>
      </article>
    </main>
  );
}
