import { DriveHeader } from "@/components/drive-header";
import { DriveClient } from "@/components/drive-client";
import { FileList, type HostedFile } from "@/components/file-list";
import { UploadPanel } from "@/components/upload-panel";
import { isBlobConfigured, isClerkConfigured } from "@/lib/config";

export const dynamic = "force-dynamic";

const demoFiles: HostedFile[] = [
  { url: "#brand-guidelines", pathname: "demo/Brand-guidelines.pdf", size: 8810000, uploadedAt: "Today, 2:14 PM", demo: true },
  { url: "#product-stills", pathname: "demo/Product-stills.zip", size: 44100000, uploadedAt: "Yesterday", demo: true },
  { url: "#project-notes", pathname: "demo/Project-notes.md", size: 14300, uploadedAt: "Sep 06", demo: true },
];

export default async function DrivePage() {
  if (isClerkConfigured) return <DriveClient blobConfigured={isBlobConfigured} />;

  return (
    <main className="drive-page">
      <DriveHeader configured={false} />
      <div className="drive-main container">
        <div className="drive-welcome"><span>WELCOME BACK</span><h1>Good to see you, there.</h1><p>Files in. Links out. That’s the whole idea.</p></div>
        <div className="setup-banner"><b>PREVIEW MODE</b><span>Add Clerk and Vercel Blob environment variables to activate secure uploads.</span></div>
        <UploadPanel enabled={false} uploadPrefix="demo" />
        <FileList files={demoFiles} canDelete={false} />
      </div>
    </main>
  );
}

