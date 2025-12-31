import presenzaLogo from "../assets/presenza-logo.png";
import minduraLogo from "../assets/mindura-logo.png";

function Credits() {
  return (
    <div
      className="credits-page"
      style={{
        minHeight: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        padding: "24px 16px",
      }}
    >
      {/* PRESENZA BRAND */}
      <img
        src={presenzaLogo}
        alt="Presenza"
        style={{
          height: "220px",
          marginBottom: "12px",
        }}
      />

      <h1 style={{ fontSize: "36px", fontWeight: "900" }}>
        PRESENZA
      </h1>

      <p
        style={{
          fontSize: "16px",
          color: "var(--muted)",
          marginBottom: "36px",
        }}
      >
        Presence is the proof
      </p>

      {/* TRADEMARK */}
      <p style={{ fontSize: "14px", marginBottom: "6px" }}>
        A Trademark Product Of
      </p>

      <h2
        style={{
          fontSize: "22px",
          fontWeight: "800",
          marginBottom: "14px",
        }}
      >
        MINDURA TECHNOLOGIES
      </h2>

      <img
        src={minduraLogo}
        alt="Mindura Technologies"
        style={{
          height: "200px",
          marginBottom: "48px",
        }}
      />

      {/* HEART & SOUL */}
      <p
        style={{
          fontSize: "18px",
          fontWeight: "600",
          marginBottom: "10px",
        }}
      >
        Heart and Soul
      </p>

      <p style={{ fontSize: "16px", fontWeight: "500" }}>
        DIVAGAR E
      </p>
      <p
        style={{
          fontSize: "16px",
          fontWeight: "500",
          marginBottom: "48px",
        }}
      >
        THIRUMALAI D
      </p>

      {/* COPYRIGHT */}
      <p
        style={{
          fontSize: "12px",
          color: "var(--muted)",
          marginTop: "auto",
        }}
      >
        © 2026 MINDURA TECHNOLOGIES. All rights reserved.
      </p>
    </div>
  );
}

export default Credits;
