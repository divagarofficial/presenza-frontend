import { useEffect, useState } from "react";
import api from "../../api/api";
import Popup from "../../components/Popup";
import { FaCheckCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function CRManualAttendance() {
  const navigate = useNavigate();

  const [students, setStudents] = useState([]);
  const [records, setRecords] = useState({});
  const [popup, setPopup] = useState({
    show: false,
    type: "",
    message: "",
  });
  const [loading, setLoading] = useState(true);

  /* ---------------- FETCH STUDENTS ---------------- */
  useEffect(() => {
    api
      .get("/cr/attendance/daily/manual/students")
      .then((res) => setStudents(res.data.students))
      .catch(() =>
        setPopup({
          show: true,
          type: "error",
          message: "Failed to load students",
        })
      )
      .finally(() => setLoading(false));
  }, []);

  /* ---------------- UPDATE STATUS ---------------- */
  const updateStatus = (roll, status) => {
    setRecords((prev) => ({
      ...prev,
      [roll]: status,
    }));
  };

  /* ---------------- SUBMIT ---------------- */
  const submitAttendance = async () => {
    if (Object.keys(records).length === 0) {
      setPopup({
        show: true,
        type: "error",
        message: "Please mark at least one student as Present or OD",
      });
      return;
    }

    const payload = {
      records: Object.entries(records).map(([roll, status]) => ({
        roll_number: roll,
        status: status.toUpperCase(),
      })),
    };

    try {
      await api.post("/cr/attendance/daily/manual/bulk", payload);

      setPopup({
        show: true,
        type: "success",
        message: "Attendance submitted successfully",
      });
    } catch (err) {
      console.error("SUBMIT ERROR:", err?.response?.data || err);
      setPopup({
        show: true,
        type: "error",
        message:
          err?.response?.data?.detail ||
          "Attendance submission failed. Please try again.",
      });
    }
  };

  if (loading) return <p className="muted">Loading students…</p>;

  return (
    <div className="cr-scan-page">
      <h2>Manual Attendance</h2>
      <p className="muted">
        Date: {new Date().toLocaleDateString("en-GB")}
      </p>

      {/* TABLE HEADER */}
      <div className="cr-student-row header">
        <span>Roll No</span>
        <span>Name</span>
        <span className="center">Present</span>
        <span className="center">OD</span>
      </div>

      {/* STUDENT LIST */}
      {students.map((s) => (
        <div key={s.roll_number} className="cr-student-row">
          <span>{s.roll_number}</span>
          <span>{s.name}</span>

          <span className="center">
            <input
              type="radio"
              name={s.roll_number}
              checked={records[s.roll_number] === "PRESENT"}
              onChange={() =>
                updateStatus(s.roll_number, "PRESENT")
              }
            />
          </span>

          <span className="center">
            <input
              type="radio"
              name={s.roll_number}
              checked={records[s.roll_number] === "OD"}
              onChange={() =>
                updateStatus(s.roll_number, "OD")
              }
            />
          </span>
        </div>
      ))}

      {/* SUBMIT BUTTON */}
      <div className="cr-actions">
        <button className="primary-btn" onClick={submitAttendance}>
          <FaCheckCircle /> Submit Attendance
        </button>
      </div>

      {/* POPUP */}
      {popup.show && (
  <Popup
    type={popup.type}
    message={popup.message}
    onClose={() => {
      setPopup({ show: false, type: "", message: "" });

      // ✅ ALWAYS redirect to Manual Attendance page
      window.location.href = "/student/cr/manual-attendance";
    }}
  />
)}

    </div>
  );
}

export default CRManualAttendance;
