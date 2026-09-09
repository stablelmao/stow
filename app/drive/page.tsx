import { auth, currentUser } from "@clerk/nextjs/server";
import { list } from "@vercel/blob";
import { DriveHeader } from "@/components/drive-header";
import { FileList, type HostedFile } from "@/components/file-list";
import { UploadPanel } from "@/components/upload-panel";
import { isBlobConfigured, isClerkConfigured } from "@/lib/config";
import { createShareId } from "@/lib/share";

export const dynamic = "force-dynamic";

const demoFiles: HostedFile[] = [
  { url: "#brand-guidelines", pathname: "demo/Brand-guidelines.pdf", size: 8810000, uploadedAt: "Today, 2:14 PM", demo: true },
  { url: "#product-stills", pathname: "demo/Product-stills.zip", size: 44100000, uploadedAt: "Yesterday", demo: true },
  { url: "#project-notes", pathname: "demo/Project-notes.md", size: 14300, uploadedAt: "Sep 06", demo: true },
];

export default async function DrivePage() {
  let userId = "demo";
  let firstName = "there";

  if (isClerkConfigured) {
    const [session, user] = await Promise.all([auth(), currentUser()]);
    userId = session.userId ?? "";
    firstName = user?.firstName ?? "there";
  }

  let files = demoFiles;
  if (isBlobConfigured && isClerkConfigured && userId) {
    const result = await list({ prefix: `${userId}/`, limit: 100 });
    files = result.blobs.map((blob) => ({
      url: blob.url,
      shareUrl: `/f/${createShareId(blob.pathname)}`,
      pathname: blob.pathname,
      size: blob.size,
      uploadedAt: new Intl.DateTimeFormat("en", { month: "short", day: "numeric" }).format(blob.uploadedAt),
    }));
  }

  const live = isBlobConfigured && isClerkConfigured && Boolean(userId);

  return (
    <main className="drive-page">
      <DriveHeader configured={isClerkConfigured} />
      <div className="drive-main container">
        <div className="drive-welcome"><span>WELCOME BACK</span><h1>Good to see you, {firstName}.</h1><p>Files in. Links out. That’s the whole idea.</p></div>
        {!live && <div className="setup-banner"><b>PREVIEW MODE</b><span>Add Clerk and Vercel Blob environment variables to activate secure uploads.</span></div>}
        <UploadPanel enabled={live} uploadPrefix={userId} />
        <FileList files={files} canDelete={live} />
      </div>
    </main>
  );
}
