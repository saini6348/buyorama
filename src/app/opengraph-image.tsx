import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #FFC94A 0%, #F2790A 45%, #E91E76 100%)",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ fontSize: 100, fontWeight: 800, color: "#16213E", letterSpacing: -3 }}>BUY-O-RAMA</div>
        <div style={{ fontSize: 32, fontWeight: 700, color: "#16213E", marginTop: 20 }}>We Do the Searching. You Do the Saving.</div>
      </div>
    ),
    { ...size }
  );
}
