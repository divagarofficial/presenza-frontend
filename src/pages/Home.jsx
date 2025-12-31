import { Link } from "react-router-dom";
import { FaUserGraduate, FaUserShield } from "react-icons/fa";
import minduraLogo from "../assets/mindura-logo.png";
import presenzaLogo from "../assets/presenza-logo.png";

function Home() {
  return (
    <div className="page">
      {/* ===== BRAND ===== */}
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <img
          src={minduraLogo}
          alt="Mindura"
          style={{
            height: "96px",
            marginBottom: "6px",
          }}
        />
        <h2>MINDURA TECHNOLOGIES</h2>
      </div>

      {/* ===== PRESENZA HERO BOX ===== */}
      <div
        className="presenza-box"
        style={{ marginBottom: "60px" }}
      >
        <img
          src={presenzaLogo}
          alt="Presenza"
          style={{
            height: "220px",
            marginBottom: "6px",
          }}
        />
        <h1>PRESENZA</h1>
        <p>Presence is the proof</p>
      </div>

      {/* ===== ROLE PROMPT ===== */}
      <p
        style={{
          textAlign: "center",
          marginBottom: "10px",
          marginTop: "6px",
          fontWeight: "500",
        }}
      >
        You are a
      </p>

      {/* ===== ROLE CARDS ===== */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "14px",
        }}
      >
        <Link to="/student/login" style={{ textDecoration: "none" }}>
          <div className="card">
            <FaUserGraduate style={{ fontSize: "36px" }} />
            Student
          </div>
        </Link>

        <Link to="/admin/login" style={{ textDecoration: "none" }}>
          <div className="card">
            <FaUserShield style={{ fontSize: "36px" }} />
            Admin
          </div>
        </Link>
      </div>
    </div>
  );
}

export default Home;
