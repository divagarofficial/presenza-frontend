import {
  FaIdBadge,
  FaBuilding,
  FaLayerGroup,
  FaUsers,
  FaLock,
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "../api/api";
import Popup from "../components/Popup";
import presenzaLogo from "../assets/presenza-logo.png";

function AdminRegister() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    admin_id: "",
    department: "",
    year: "",
    section: "",
    password: "",
    confirmPassword: "",
  });

  const [popup, setPopup] = useState({ type: "", message: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async () => {
    if (
      !form.admin_id ||
      !form.department ||
      !form.year ||
      !form.section ||
      !form.password
    ) {
      setPopup({
        type: "error",
        message: "All fields are required",
      });
      return;
    }

    if (form.password !== form.confirmPassword) {
      setPopup({
        type: "error",
        message: "Passwords do not match",
      });
      return;
    }

    try {
      await api.post(
        "/auth/admin/register",
        {
          admin_id: form.admin_id.trim(),
          department: form.department.trim(),
          year: form.year.trim(),
          section: form.section.trim(),
          password: form.password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // SUCCESS POPUP (NO AUTO REDIRECT)
      setPopup({
        type: "success",
        message: "Admin registered successfully",
      });

    } catch (err) {
      setPopup({
        type: "error",
        message:
          err.response?.data?.detail || "Registration failed",
      });
    }
  };

  return (
    <div className="page">
      {/* BRAND */}
      <div style={{ textAlign: "center", marginBottom: "24px" }}>
        <img src={presenzaLogo} alt="Presenza" style={{ height: "120px" }} />
        <h1>PRESENZA</h1>
        <p>Admin Registration</p>
      </div>

      <div className="form-card">
        <div className="form-group">
          <label><FaIdBadge /> Admin ID</label>
          <input
            name="admin_id"
            value={form.admin_id}
            onChange={handleChange}
          />
        </div>

        {/* DEPARTMENT */}
        <div className="form-group">
          <label><FaBuilding /> Department</label>
          <select
            name="department"
            value={form.department}
            onChange={handleChange}
          >
            <option value="">Select Department</option>
            <option value="BE COMPUTER SCIENCE AND ENGINEERING">
              BE Computer Science and Engineering
            </option>
            <option value="BTECH ARTIFICIAL INTELLIGENCE AND DATA SCIENCE">
              B.Tech Artificial Intelligence and Data Science
            </option>
            <option value="BE COMPUTER SCIENCE AND ENGINEERING (AI&ML)">
              BE CSE (AI & ML)
            </option>
            <option value="BE ELECTRONICS AND COMMUNICATION ENGINEERING">
              BE Electronics and Communication Engineering
            </option>
            <option value="BE ECE (VLSI)">
              BE ECE (VLSI)
            </option>
            <option value="BE COMPUTER AND COMMUNICATION ENGINEERING">
              BE Computer and Communication Engineering
            </option>
            <option value="BTECH COMPUTER SCIENCE AND BUSINESS SYSTEMS">
              B.Tech Computer Science and Business Systems
            </option>
            <option value="BTECH BIOTECHNOLOGY">
              B.Tech Biotechnology
            </option>
          </select>
        </div>

        {/* YEAR */}
        <div className="form-group">
          <label><FaLayerGroup /> Year</label>
          <select name="year" value={form.year} onChange={handleChange}>
            <option value="">Select Year</option>
            <option value="I">I</option>
            <option value="II">II</option>
            <option value="III">III</option>
            <option value="IV">IV</option>
          </select>
        </div>

        <div className="form-group">
          <label><FaUsers /> Section</label>
          <input
            name="section"
            value={form.section}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label><FaLock /> Password</label>
          <input
            type="password"
            name="password"
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label><FaLock /> Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            onChange={handleChange}
          />
        </div>

        <button className="primary-btn" onClick={handleRegister}>
          Register
        </button>

        <p style={{ marginTop: "14px", textAlign: "center" }}>
          Already registered?{" "}
          <Link to="/admin/login">Login here</Link>
        </p>
      </div>

      {/* PRESENZA POPUP */}
      <Popup
  type={popup.type}
  message={popup.message}
  actionText={popup.type === "success" ? "Done" : "Retry"}
  onAction={() => {
    if (popup.type === "success") {
      navigate("/admin/login");
    } else {
      setPopup({ type: "", message: "" });
    }
  }}
/>

    </div>
  );
}

export default AdminRegister;
