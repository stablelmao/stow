"use client";

import { upload } from "@vercel/blob/client";
import { CheckCircle, CloudArrowUp, File, WarningCircle, X } from "@phosphor-icons/react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

type UploadState = "idle" | "uploading" | "success" | "error";

function formatBytes(bytes: number) {
  if (!bytes) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  return `${(bytes / 1024 ** index).toFixed(index ? 1 : 0)} ${units[index]}`;
}

export function UploadPanel({ enabled, uploadPrefix }: { enabled: boolean; uploadPrefix: string }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<UploadState>("idle");
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("");

  const selectFile = (next: File | undefined) => {
    if (!next) return;
    setFile(next);
    setStatus("idle");
    setMessage("");
    setProgress(0);
  };

  const startUpload = async () => {
    if (!file || !enabled) return;
    setStatus("uploading");
    setMessage("");
    try {
      await upload(`${uploadPrefix}/${file.name}`, file, {
        access: "public",
        handleUploadUrl: "/api/upload",
        multipart: file.size > 10 * 1024 * 1024,
        onUploadProgress: ({ percentage }) => setProgress(Math.round(percentage)),
      });
      setProgress(100);
      setStatus("success");
      window.setTimeout(() => {
        setFile(null);
        setStatus("idle");
        router.refresh();
      }, 900);
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Upload failed. Please try again.");
    }
  };

  return (
    <section className="drive-upload" aria-labelledby="upload-title">
      <div className="upload-intro">
        <span className="upload-number">01 / UPLOAD</span>
        <h2 id="upload-title">Put something somewhere safe.</h2>
        <p>Your upload goes straight to object storage. Nothing gets resized, compressed, or “optimized.”</p>
      </div>
      <div
        className={`big-dropzone ${file ? "has-file" : ""}`}
        onDragOver={(event) => event.preventDefault()}
        onDrop={(event) => { event.preventDefault(); selectFile(event.dataTransfer.files[0]); }}
      >
        <input ref={inputRef} type="file" hidden onChange={(event) => selectFile(event.target.files?.[0])} />
        {!file ? (
          <>
            <span className="big-upload-icon"><CloudArrowUp size={30} weight="bold" /></span>
            <div><strong>Drop any file here</strong><span>or use the button to browse</span></div>
            <button className="dark-button" onClick={() => inputRef.current?.click()}>Choose file</button>
          </>
        ) : (
          <div className="selected-file">
            <span className="selected-icon"><File size={24} weight="fill" /></span>
            <div className="selected-meta"><strong>{file.name}</strong><span>{formatBytes(file.size)}</span></div>
            {status === "uploading" || status === "success" ? (
              <div className="progress-block">
                <span>{status === "success" ? <><CheckCircle size={16} weight="fill" /> Done</> : `${progress}%`}</span>
                <i><b style={{ width: `${progress}%` }} /></i>
              </div>
            ) : (
              <>
                <button className="icon-button" onClick={() => setFile(null)} aria-label="Remove selected file"><X size={18} /></button>
                <button className="blue-button" disabled={!enabled} onClick={startUpload}>{enabled ? "Upload now" : "Setup required"}</button>
              </>
            )}
          </div>
        )}
        {status === "error" && <p className="upload-error"><WarningCircle size={17} /> {message}</p>}
      </div>
    </section>
  );
}

