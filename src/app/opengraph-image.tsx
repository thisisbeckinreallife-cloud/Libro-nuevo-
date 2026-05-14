/* eslint-disable @next/next/no-img-element */
import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt =
  "El método Arkwright — La mayor oportunidad desde 1760. Por Lara Lawn.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Open Graph image dinámica. Next.js la renderiza una sola vez al
 * build y la sirve estática desde /opengraph-image (1200x630).
 *
 * Diseño: fondo navy (color de la portada) + portada del libro a la
 * izquierda + headline a la derecha con "1760" en magenta italic
 * (igual que el H1 de la landing).
 */
export default async function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "#0A1230",
          color: "#FAF9F7",
          fontFamily: "Georgia, serif",
          padding: "60px",
        }}
      >
        <div
          style={{
            flex: "1",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            paddingRight: "40px",
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: "14px",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "#E91E63",
              fontFamily: "system-ui, sans-serif",
              marginBottom: "32px",
            }}
          >
            El método Arkwright · Lara Lawn
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontSize: "68px",
              fontWeight: 700,
              lineHeight: 1.05,
              letterSpacing: "-0.02em",
            }}
          >
            <span>La mayor</span>
            <span>oportunidad</span>
            <span>
              desde{" "}
              <span style={{ color: "#E91E63", fontStyle: "italic" }}>
                1760.
              </span>
            </span>
          </div>
          <div
            style={{
              display: "flex",
              marginTop: "40px",
              fontSize: "20px",
              fontFamily: "system-ui, sans-serif",
              color: "rgba(250, 249, 247, 0.7)",
              letterSpacing: "0.05em",
            }}
          >
            arkwright.laralawn.com
          </div>
        </div>
        <div
          style={{
            width: "360px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              width: "300px",
              height: "440px",
              background: "#0A1230",
              border: "2px solid rgba(224, 88, 8, 0.4)",
              borderRadius: "6px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "32px 24px",
              boxShadow: "0 24px 64px rgba(0,0,0,0.5)",
            }}
          >
            <div
              style={{
                fontSize: "11px",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "rgba(250, 249, 247, 0.5)",
                fontFamily: "system-ui, sans-serif",
                marginBottom: "20px",
              }}
            >
              El método
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                fontFamily: "Georgia, serif",
                fontSize: "44px",
                fontWeight: 700,
                color: "#E05808",
                lineHeight: 1,
                textAlign: "center",
              }}
            >
              <span>ARK</span>
              <span>WRIGHT</span>
            </div>
            <div
              style={{
                width: "80px",
                height: "1px",
                background: "rgba(224, 88, 8, 0.5)",
                margin: "32px 0",
              }}
            />
            <div
              style={{
                fontSize: "13px",
                fontFamily: "system-ui, sans-serif",
                color: "rgba(250, 249, 247, 0.6)",
                letterSpacing: "0.1em",
              }}
            >
              LARA LAWN
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
