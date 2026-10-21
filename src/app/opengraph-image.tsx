import { ImageResponse } from "next/og";
import { PERSON } from "@/lib/site";

// The link-preview image for every page (LinkedIn, X, Slack, ...). Next renders
// it at build time and adds the og:image and twitter:image tags itself.
export const alt = `${PERSON.name} — ${PERSON.jobTitle}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px 96px",
          background: "#ffffff",
          borderLeft: "24px solid #103dc2",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ fontSize: 84, fontWeight: 700, color: "#1a1a1a" }}>{PERSON.name}</div>
        <div style={{ marginTop: 20, fontSize: 44, color: "#103dc2" }}>{PERSON.jobTitle}</div>
        <div style={{ marginTop: 36, fontSize: 32, color: "#555555", lineHeight: 1.4 }}>
          Grounded retrieval, hybrid search, and Java/Spring systems at scale.
        </div>
        <div style={{ marginTop: "auto", fontSize: 28, color: "#888888" }}>www.lazymonk.si</div>
      </div>
    ),
    size
  );
}
