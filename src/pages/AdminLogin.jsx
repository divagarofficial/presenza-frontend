import { FaUserShield, FaLock } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "../api/api";
import Popup from "../components/Popup";
import presenzaLogo from "../assets/presenza-logo.png";

function AdminLogin() {
  const navigate = useNavigate();

  const [adminId, setAdminId] = useState("");
  const [password, setPassword] = useState("");

  const [popup, setPopup] = useState({
    type: "",
    message: "",
  });

  const handleLogin = async () => {
    if (!adminId || !password) {
      setPopup({
        type: "error",
        message: "Admin ID and Password are required",
      });
      return;
    }

    const formData = new URLSearchParams();
    formData.append("username", adminId);
    formData.append("password", password);

    try {
      const res = await api.post(
        "/auth/admin/login",
        formData,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      localStorage.setItem("token", res.data.access_token);

      setPopup({
        type: "success",
        message: "Login successful",
      });

    } catch (err) {
      setPopup({
        type: "error",
        message:
          err.response?.data?.detail ||
          "Invalid admin credentials",
      });
    }
  };

  return (
    <div className="page">
      {/* PRESENZA BRAND */}
      <div style={{ textAlign: "center", marginBottom: "24px" }}>
        <img
          src={presenzaLogo}
          alt="Presenza"
          style={{ height: "120px", marginBottom: "6px" }}
        />
        <h1>PRESENZA</h1>
        <p>Admin Access</p>
      </div>

      {/* LOGIN CARD */}
      <div className="form-card">
        <div className="form-group">
          <label>
            <FaUserShield style={{ marginRight: "6px" }} />
            Admin ID
          </label>
          <input
            type="text"
            value={adminId}
            onChange={(e) => setAdminId(e.target.value)}
            placeholder="Enter admin ID"
          />
        </div>

        <div className="form-group">
          <label>
            <FaLock style={{ marginRight: "6px" }} />
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
          />
        </div>

        <button className="primary-btn" onClick={handleLogin}>
          Login
        </button>

        <p
          style={{
            marginTop: "14px",
            textAlign: "center",
            fontSize: "14px",
          }}
        >
          Want to register?{" "}
          <Link
            to="/admin/register"
            style={{
              color: "var(--primary)",
              fontWeight: "600",
              textDecoration: "none",
            }}
          >
            Register here
          </Link>
        </p>
      </div>

      {/* PRESENZA POPUP */}
      <Popup
        type={popup.type}
        message={popup.message}
        actionText={popup.type === "success" ? "Done" : "Retry"}
        onAction={() => {
          if (popup.type === "success") {
            navigate("/admin/dashboard");
          } else {
            setPopup({ type: "", message: "" });
          }
        }}
      />
    </div>
  );
}

export default AdminLogin;
