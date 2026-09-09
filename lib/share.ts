const RANDOM_SUFFIX_RE = /-[a-zA-Z0-9]{20,}(?=\.[^.]+$|$)/;

export function createShareId(pathname: string) {
  return Buffer.from(pathname, "utf8").toString("base64url");
}

export function readShareId(id: string) {
  if (!/^[A-Za-z0-9_-]{1,2048}$/.test(id)) throw new Error("Invalid share link");
  const pathname = Buffer.from(id, "base64url").toString("utf8");
  if (!pathname || pathname.includes("..") || pathname.startsWith("/")) throw new Error("Invalid share link");
  return pathname;
}

export function displayFileName(pathname: string) {
  return pathname.split("/").at(-1)?.replace(RANDOM_SUFFIX_RE, "") || "Shared file";
}

export function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  return `${(bytes / 1024 / 1024 / 1024).toFixed(1)} GB`;
}
