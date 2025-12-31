import { useState } from "react";
import api from "../../api/api";
import Popup from "../../components/Popup";

function StudentRegister() {
  const [form, setForm] = useState({
    roll_number: "",
    name: "",
    department: "",
    year: "",
    section: "",
    mobile: "",
    is_cr: false,
  });

  const [loading, setLoading] = useState(false);
  const [popup, setPopup] = useState({ type: "", message: "" });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async () => {
    // 🔐 Frontend validation
    if (
      !form.roll_number ||
      !form.name ||
      !form.department ||
      !form.year ||
      !form.section ||
      !form.mobile
    ) {
      setPopup({
        type: "error",
        message: "All fields are required",
      });
      return;
    }

    if (!/^\d{10}$/.test(form.mobile)) {
      setPopup({
        type: "error",
        message: "Enter a valid 10-digit mobile number",
      });
      return;
    }

    setLoading(true);

    try {
      await api.post(
        "/admin/students",
        {
          roll_number: form.roll_number.trim(),
          name: form.name.trim(),
          department: form.department,
          year: form.year,
          section: form.section.trim(),
          mobile: form.mobile.trim(),
          is_cr: form.is_cr,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      setPopup({
        type: "success",
        message: "Student registered successfully",
      });

      // 🔄 Reset form
      setForm({
        roll_number: "",
        name: "",
        department: "",
        year: "",
        section: "",
        mobile: "",
        is_cr: false,
      });

    } catch (err) {
      setPopup({
        type: "error",
        message:
          err.response?.data?.detail ||
          err.message ||
          "Student registration failed",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-page">
      <h2>Register Student</h2>
      <p className="muted">Admin-only student onboarding</p>

      <div className="form-card">
        <div className="form-group">
          <label>Roll Number</label>
          <input
            name="roll_number"
            value={form.roll_number}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Name</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Department</label>
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

        <div className="form-row">
          <div className="form-group">
            <label>Year</label>
            <select
              name="year"
              value={form.year}
              onChange={handleChange}
            >
              <option value="">Select</option>
              <option value="I">I</option>
              <option value="II">II</option>
              <option value="III">III</option>
              <option value="IV">IV</option>
            </select>
          </div>

          <div className="form-group">
            <label>Section</label>
            <input
              name="section"
              value={form.section}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-group">
          <label>Mobile</label>
          <input
            name="mobile"
            value={form.mobile}
            onChange={handleChange}
          />
        </div>

        <div className="form-checkbox">
          <input
            type="checkbox"
            name="is_cr"
            checked={form.is_cr}
            onChange={handleChange}
          />
          <label>Assign as Class Representative</label>
        </div>

        <button
          className="primary-btn"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Registering..." : "Register Student"}
        </button>
      </div>

      <Popup
        type={popup.type}
        message={popup.message}
        actionText="OK"
        onAction={() => setPopup({ type: "", message: "" })}
      />
    </div>
  );
}

export default StudentRegister;
