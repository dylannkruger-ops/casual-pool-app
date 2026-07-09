import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Lucen — premium website layers, with the prompt and assets included";

/** Site-wide OG card. */
export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: 28,
          backgroundColor: "#050608",
          backgroundImage:
            "radial-gradient(1000px 520px at 50% -20%, rgba(79,227,232,0.3), transparent 60%)",
          padding: 80,
          color: "#ECEAE3",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 22,
              height: 22,
              borderRadius: 999,
              background: "#4FE3E8",
              boxShadow: "0 0 28px 6px rgba(79,227,232,0.7)",
            }}
          />
          <div style={{ fontSize: 34, fontWeight: 600 }}>lucen</div>
        </div>
        <div style={{ fontSize: 82, fontWeight: 700, letterSpacing: -2, lineHeight: 1.05, maxWidth: 1000 }}>
          Premium website layers, with the prompt and assets included.
        </div>
        <div style={{ fontSize: 32, color: "#9AA1AD" }}>
          Browse. Preview live. Unlock the build prompt + assets.
        </div>
      </div>
    ),
    size,
  );
}
