import { ImageResponse } from "next/og";
import { getItemBySlug } from "@/lib/data/items";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Lucen item";

/** Per-item OG card — dark base, cyan accent, title + tagline + tier. */
export default async function OgImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = await getItemBySlug(slug);
  const title = item?.title ?? "Lucen";
  const tagline =
    item?.tagline ?? "Premium website layers, with the prompt and assets included.";
  const tier = item?.tier ?? "premium";
  const category = item?.category ?? "";

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#050608",
          backgroundImage:
            "radial-gradient(1000px 500px at 15% -10%, rgba(79,227,232,0.28), transparent 60%)",
          padding: 72,
          color: "#ECEAE3",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 18,
              height: 18,
              borderRadius: 999,
              background: "#4FE3E8",
              boxShadow: "0 0 24px 4px rgba(79,227,232,0.7)",
            }}
          />
          <div style={{ fontSize: 30, fontWeight: 600, letterSpacing: -0.5 }}>
            lucen
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div
            style={{
              display: "flex",
              gap: 12,
              fontSize: 22,
              color: "#4FE3E8",
              textTransform: "uppercase",
              letterSpacing: 2,
            }}
          >
            <span>{category}</span>
            <span style={{ color: "#5B6270" }}>·</span>
            <span style={{ color: tier === "free" ? "#ECEAE3" : "#F5B14C" }}>
              {tier}
            </span>
          </div>
          <div style={{ fontSize: 76, fontWeight: 700, letterSpacing: -2, lineHeight: 1.05 }}>
            {title}
          </div>
          <div style={{ fontSize: 32, color: "#9AA1AD", maxWidth: 900, lineHeight: 1.3 }}>
            {tagline}
          </div>
        </div>

        <div style={{ fontSize: 24, color: "#5B6270" }}>
          lucen.ai — new layers every Friday
        </div>
      </div>
    ),
    size,
  );
}
