"use client";

import { useAuth, useUser } from "@clerk/nextjs";
import { useCallback, useEffect, useState } from "react";
import { DriveHeader } from "@/components/drive-header";
import { FileList, type HostedFile } from "@/components/file-list";
import { UploadPanel } from "@/components/upload-panel";

export function DriveClient() {
  const { isLoaded, isSignedIn, userId, getToken } = useAuth();
  const { user } = useUser();
  const [files, setFiles] = useState<HostedFile[]>([]);
  const [loadingFiles, setLoadingFiles] = useState(true);
  const [storageReady, setStorageReady] = useState<boolean | null>(null);
  const [error, setError] = useState("");

  const loadFiles = useCallback(async () => {
    if (!isSignedIn) return;

    setLoadingFiles(true);
    setError("");
    try {
      const token = await getToken();
      const response = await fetch("/api/files", {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        cache: "no-store",
      });
      if (response.status === 503) {
        setStorageReady(false);
        setFiles([]);
        return;
      }
      if (!response.ok) throw new Error("Could not load your files.");
      const data = (await response.json()) as { files: HostedFile[] };
      setStorageReady(true);
      setFiles(data.files);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Could not load your files.");
    } finally {
      setLoadingFiles(false);
    }
  }, [getToken, isSignedIn]);

  useEffect(() => {
    if (!isLoaded) return;
    if (!isSignedIn) {
      window.location.replace(`/sign-in?redirect_url=${encodeURIComponent(`${window.location.origin}/drive`)}`);
      return;
    }
    const timer = window.setTimeout(() => void loadFiles(), 0);
    return () => window.clearTimeout(timer);
  }, [isLoaded, isSignedIn, loadFiles]);

  if (!isLoaded || !isSignedIn) {
    return <main className="auth-page"><div className="auth-loading">Opening your drive…</div></main>;
  }

  const live = storageReady === true && Boolean(userId);
  const getAuthToken = () => getToken();

  return (
    <main className="drive-page">
      <DriveHeader configured />
      <div className="drive-main container">
        <div className="drive-welcome"><span>WELCOME BACK</span><h1>Good to see you, {user?.firstName ?? "there"}.</h1><p>Files in. Links out. That’s the whole idea.</p></div>
        {storageReady === false && <div className="setup-banner"><b>STORAGE SETUP</b><span>Connect Vercel Blob to activate uploads.</span></div>}
        {error && <div className="setup-banner"><b>CONNECTION ISSUE</b><span>{error}</span></div>}
        <UploadPanel enabled={live} uploadPrefix={userId ?? ""} getAuthToken={getAuthToken} onUploaded={loadFiles} />
        {loadingFiles ? <div className="empty-state"><strong>Loading your files…</strong></div> : <FileList files={files} canDelete={live} getAuthToken={getAuthToken} onDeleted={loadFiles} />}
      </div>
    </main>
  );
}

