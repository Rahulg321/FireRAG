import React from "react";

export default function DemoEmbedPage() {
  return (
    <div
      style={{
        width: "100%",
        backgroundColor: "red",
        height: "100vh",
        color: "white",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "#f5f5f5",
        fontFamily: "sans-serif",
        borderRadius: 8,
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      }}
    >
      <h2 style={{ color: "white", fontSize: "24px" }}>
        Hello from the embedded bot!
      </h2>
      <p style={{ color: "white", fontSize: "16px" }}>
        This is a static demo page rendered for iframe embedding.
      </p>
    </div>
  );
}
