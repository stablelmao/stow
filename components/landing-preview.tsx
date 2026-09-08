"use client";

import { ArrowUpRight, Check, Copy, FilePdf, FileText, Image as ImageIcon, UploadSimple } from "@phosphor-icons/react";
import { useState } from "react";

const files = [
  { name: "Brand-guidelines.pdf", size: "8.4 MB", icon: FilePdf, color: "coral" },
  { name: "Launch-stills.zip", size: "42.1 MB", icon: ImageIcon, color: "blue" },
  { name: "Project-notes.md", size: "14 KB", icon: FileText, color: "ink" },
];

export function LandingPreview() {
  const [copied, setCopied] = useState<string | null>(null);

  return (
    <div className="preview-shell">
      <div className="preview-topbar">
        <div className="traffic"><i /><i /><i /></div>
        <span>my files</span>
        <ArrowUpRight size={15} />
      </div>
      <div className="preview-content">
        <div className="mini-dropzone">
          <span className="upload-glyph"><UploadSimple size={22} weight="bold" /></span>
          <div><strong>Drop it here</strong><small>or click to browse</small></div>
          <span className="upload-limit">up to 2 GB</span>
        </div>
        <div className="file-heading"><span>RECENT</span><span>3 FILES</span></div>
        <div className="preview-files">
          {files.map(({ name, size, icon: Icon, color }) => (
            <div className="preview-file" key={name}>
              <span className={`file-icon ${color}`}><Icon size={18} weight="fill" /></span>
              <div className="file-meta"><strong>{name}</strong><small>{size} · just now</small></div>
              <button
                aria-label={`Copy link for ${name}`}
                onClick={() => { setCopied(name); window.setTimeout(() => setCopied(null), 1200); }}
              >
                {copied === name ? <Check size={16} /> : <Copy size={16} />}
              </button>
            </div>
          ))}
        </div>
      </div>
      <div className="preview-stamp">PRIVATE BY DEFAULT</div>
    </div>
  );
}

