import { FaUserGraduate, FaPhone } from "react-icons/fa";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import Popup from "../components/Popup";
import presenzaLogo from "../assets/presenza-logo.png";
import { jwtDecode } from "jwt-decode";


function StudentLogin() {
  const navigate = useNavigate();

  const [rollNumber, setRollNumber] = useState("");
  const [mobile, setMobile] = useState("");
  const [popup, setPopup] = useState({ type: "", message: "" });

  const handleLogin = async () => {
    if (!rollNumber || !mobile) {
      setPopup({
        type: "error",
        message: "Roll number and mobile number are required",
      });
      return;
    }

    try {
      const res = await api.post(
        "/auth/student/login",   // ✅ CORRECT ENDPOINT
        {
          roll_number: rollNumber,
          mobile: mobile,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const token = res.data.access_token;

      // ✅ Save token
      localStorage.setItem("token", token);

      // ✅ Decode JWT
      const decoded = jwtDecode(token);

      // ✅ Save important flags
      localStorage.setItem("is_cr", decoded.is_cr ? "true" : "false");
      localStorage.setItem("roll_number", decoded.roll_number);
      localStorage.setItem("student_id", decoded.student_id);

      setPopup({
        type: "success",
        message: "Login successful. Welcome to Presenza!",
      });

    } catch (err) {
      setPopup({
        type: "error",
        message:
          err.response?.data?.detail || "Student login failed",
      });
    }
  };

  return (
    <div className="page">
      {/* BRAND */}
      <div style={{ textAlign: "center", marginBottom: "24px" }}>
        <img
          src={presenzaLogo}
          alt="Presenza"
          style={{ height: "120px", marginBottom: "6px" }}
        />
        <h1>PRESENZA</h1>
        <p>Student Login</p>
      </div>

      {/* LOGIN CARD */}
      <div className="form-card">
        <div className="form-group">
          <label>
            <FaUserGraduate style={{ marginRight: "6px" }} />
            Roll Number
          </label>
          <input
            type="text"
            placeholder="Enter roll number"
            value={rollNumber}
            onChange={(e) => setRollNumber(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>
            <FaPhone style={{ marginRight: "6px" }} />
            Mobile Number
          </label>
          <input
            type="text"
            placeholder="Registered mobile number"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
          />
        </div>

        <button className="primary-btn" onClick={handleLogin}>
          Login
        </button>
      </div>

      {/* POPUP */}
      <Popup
        type={popup.type}
        message={popup.message}
        actionText={popup.type === "success" ? "Done" : "Retry"}
        onAction={() => {
          if (popup.type === "success") {
            navigate("/student/dashboard");
          } else {
            setPopup({ type: "", message: "" });
          }
        }}
      />
    </div>
  );
}

export default StudentLogin;
