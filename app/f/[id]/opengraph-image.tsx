import { ImageResponse } from "next/og";
import { head } from "@vercel/blob";
import { displayFileName, formatFileSize, readShareId } from "@/lib/share";

export const alt = "A file shared with Stow";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpenGraphImage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let name = "Shared file";
  let details = "A file shared with Stow";
  let previewUrl: string | null = null;
  try {
    const blob = await head(readShareId(id));
    name = displayFileName(blob.pathname);
    details = `${formatFileSize(blob.size)} · ${blob.contentType || "File"}`;
    if (blob.contentType.startsWith("image/")) previewUrl = blob.url;
  } catch {}

  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", padding: 54, background: "#171714", color: "#fffef9" }}>
      <div style={{ width: "100%", display: "flex", overflow: "hidden", border: "2px solid #fffef9", borderRadius: 28, background: "#f4f2eb", color: "#171714", boxShadow: "18px 18px 0 #2f5bea" }}>
        <div style={{ width: "43%", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", background: "#dbe3ff" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          {previewUrl ? <img src={previewUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <div style={{ display: "flex", fontSize: 150, color: "#2f5bea" }}>↗</div>}
        </div>
        <div style={{ width: "57%", display: "flex", flexDirection: "column", justifyContent: "center", padding: 52 }}>
          <div style={{ display: "flex", color: "#e35f3f", fontSize: 22, fontWeight: 700, letterSpacing: 3 }}>SHARED WITH STOW</div>
          <div style={{ display: "flex", marginTop: 24, fontSize: 52, fontWeight: 800, lineHeight: 1.05, overflowWrap: "anywhere" }}>{name}</div>
          <div style={{ display: "flex", marginTop: 25, color: "#67665f", fontSize: 25 }}>{details}</div>
        </div>
      </div>
    </div>,
    size,
  );
}
