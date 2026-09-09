"use client";

import { ArrowSquareOut, Check, Copy, DotsThree, File, FilePdf, Image as ImageIcon, Trash } from "@phosphor-icons/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export type HostedFile = { url: string; shareUrl?: string; pathname: string; size: number; uploadedAt: string; demo?: boolean };

const RANDOM_SUFFIX_RE = /-[a-zA-Z0-9]{20,}(?=\.[^.]+$|$)/;

function size(bytes: number) {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

function fileIcon(name: string) {
  if (/\.(png|jpe?g|webp|gif)$/i.test(name)) return ImageIcon;
  if (/\.pdf$/i.test(name)) return FilePdf;
  return File;
}

export function FileList({ files, canDelete }: { files: HostedFile[]; canDelete: boolean }) {
  const router = useRouter();
  const [copied, setCopied] = useState<string | null>(null);
  const [menu, setMenu] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  const copy = async (item: HostedFile) => {
    const shareUrl = item.shareUrl ? new URL(item.shareUrl, window.location.origin).toString() : item.url;
    await navigator.clipboard.writeText(shareUrl);
    setCopied(item.url);
    window.setTimeout(() => setCopied(null), 1200);
  };

  const remove = async (item: HostedFile) => {
    if (!canDelete || item.demo) return;
    setDeleting(item.url);
    const response = await fetch(`/api/files?url=${encodeURIComponent(item.url)}`, { method: "DELETE" });
    setDeleting(null);
    setMenu(null);
    if (response.ok) router.refresh();
  };

  return (
    <section className="files-section" aria-labelledby="files-title">
      <div className="files-title-row"><div><span>02 / LIBRARY</span><h2 id="files-title">Your files</h2></div><b>{files.length.toString().padStart(2, "0")}</b></div>
      {files.length === 0 ? (
        <div className="empty-state"><File size={30} /><strong>The shelf is empty.</strong><span>Upload your first file above and it’ll appear here.</span></div>
      ) : (
        <div className="file-table">
          <div className="file-table-head"><span>NAME</span><span>SIZE</span><span>UPLOADED</span><span /></div>
          {files.map((item) => {
            const name = item.pathname.split("/").slice(1).join("/").replace(RANDOM_SUFFIX_RE, "");
            const Icon = fileIcon(name);
            return (
              <div className={`file-row ${deleting === item.url ? "is-deleting" : ""}`} key={item.url}>
                <div className="row-name"><span><Icon size={19} weight="fill" /></span><strong>{name}</strong></div>
                <span>{size(item.size)}</span>
                <span>{item.uploadedAt}</span>
                <div className="row-actions">
                  <button onClick={() => copy(item)} aria-label={`Copy link for ${name}`}>{copied === item.url ? <Check size={18} /> : <Copy size={18} />}</button>
                  <a href={item.shareUrl ?? item.url} target="_blank" rel="noreferrer" aria-label={`Open ${name}`}><ArrowSquareOut size={18} /></a>
                  <button onClick={() => setMenu(menu === item.url ? null : item.url)} aria-label={`More options for ${name}`}><DotsThree size={21} weight="bold" /></button>
                  {menu === item.url && (
                    <div className="file-menu"><button disabled={!canDelete || item.demo} onClick={() => remove(item)}><Trash size={16} /> {item.demo ? "Demo file" : "Delete file"}</button></div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
