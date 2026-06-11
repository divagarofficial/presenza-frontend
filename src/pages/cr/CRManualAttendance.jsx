import { useEffect, useState } from "react";
import api from "../../api/api";
import Popup from "../../components/Popup";
import { FaCheckCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function CRManualAttendance() {
  const navigate = useNavigate();

  // purely for nicer UI; attendance update logic is date-driven
  const statusLabel = (st) => {
    const s = (st || "ABSENT").toUpperCase();
    if (s === "PRESENT") return "Present";
    if (s === "OD") return "OD";
    return "Absent";
  };


  const [students, setStudents] = useState([]);
  const [records, setRecords] = useState({});
  const [selectedDate, setSelectedDate] = useState(() => {
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, "0");
    const dd = String(now.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  });
  const [loadingEdit, setLoadingEdit] = useState(false);

  const [popup, setPopup] = useState({
    show: false,
    type: "",
    message: "",
  });
  const [loading, setLoading] = useState(true);

  /* ---------------- FETCH EDIT STATE (by date) ---------------- */
  useEffect(() => {
    setLoadingEdit(true);
    api
      .get(`/cr/attendance/daily/edit/students?date=${selectedDate}`)
      .then((res) => {
        setStudents(res.data.students || []);
        const next = {};
        (res.data.students || []).forEach((s) => {
          next[s.roll_number] = s.status;
        });
        setRecords(next);
      })
      .catch(() =>
        setPopup({
          show: true,
          type: "error",
          message: "Failed to load attendance for selected date",
        })
      )
      .finally(() => {
        setLoading(false);
        setLoadingEdit(false);
      });
  }, [selectedDate]);


  /* ---------------- UPDATE STATUS ---------------- */
  const updateStatus = (roll, status) => {
    setRecords((prev) => ({
      ...prev,
      [roll]: status,
    }));
  };

  /* ---------------- SUBMIT ---------------- */
  const submitAttendance = async () => {

    const entries = Object.entries(records);
    if (entries.length === 0) {
      setPopup({
        show: true,
        type: "error",
        message: "No attendance records to submit",
      });
      return;
    }

    const payload = {
      date: selectedDate,
      records: entries.map(([roll, status]) => ({
        roll_number: roll,
        status: status.toUpperCase(),
      })),
    };

    try {
      await api.post("/cr/attendance/daily/edit/bulk", payload);

      setPopup({
        show: true,
        type: "success",
        message: "Attendance updated successfully",
      });
    } catch (err) {
      console.error("SUBMIT ERROR:", err?.response?.data || err);
      setPopup({
        show: true,
        type: "error",
        message:
          err?.response?.data?.detail ||
          "Attendance update failed. Please try again.",
      });
    }
  };


  if (loading) return <p className="muted">Loading students…</p>;


  return (
    <div className="cr-scan-page">
      <div className="cr-hero" style={{ marginBottom: 16 }}>
        <div className="cr-badge" style={{ fontSize: 34, marginBottom: 6 }}>
          ✍️
        </div>
        <h2 style={{ marginBottom: 6 }}>Edit Attendance</h2>
        <p style={{ opacity: 0.95 }}>
          Choose a date and update Present / OD / Absent for your section.
        </p>
      </div>

      <div className="cr-actions" style={{ marginBottom: 14 }}>
        <div className="summary-card" style={{ width: "100%" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <div style={{ fontWeight: 800, color: "var(--secondary)" }}>Selected date</div>
            <div className="date-chip" style={{ alignSelf: "flex-start" }}>
              {selectedDate}
            </div>
          </div>

          <div style={{ minWidth: 180 }}>
            <label style={{ display: "block", marginBottom: 6, fontWeight: 700, color: "var(--secondary)" }}>
              Pick date
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>
        </div>
      </div>


      {/* TABLE HEADER */}
      <div className="cr-student-row header">
        <span>Roll No</span>
        <span>Name</span>
        <span className="center">Present</span>
        <span className="center">OD</span>
        <span className="center">Absent</span>
      </div>


      {/* STUDENT LIST */}
      {students.map((s) => (
        <div key={s.roll_number} className="cr-student-row">
          <span>{s.roll_number}</span>
          <span>{s.name}</span>

          <span className="center">
            <input
              type="radio"
              name={`status-${s.roll_number}`}
              checked={(records[s.roll_number] || "ABSENT") === "PRESENT"}
              onChange={() => updateStatus(s.roll_number, "PRESENT")}
            />
          </span>

          <span className="center">
            <input
              type="radio"
              name={`status-${s.roll_number}`}
              checked={(records[s.roll_number] || "ABSENT") === "OD"}
              onChange={() => updateStatus(s.roll_number, "OD")}
            />
          </span>

          <span className="center">
            <input
              type="radio"
              name={`status-${s.roll_number}`}
              checked={(records[s.roll_number] || "ABSENT") === "ABSENT"}
              onChange={() => updateStatus(s.roll_number, "ABSENT")}
            />
          </span>
        </div>
      ))}


      {/* SUBMIT BUTTON */}
      <div className="cr-actions">
        <button className="primary-btn" onClick={submitAttendance} disabled={loadingEdit}>
          <FaCheckCircle /> {loadingEdit ? "Loading…" : "Update Attendance"}
        </button>
      </div>


      {/* POPUP */}
      <Popup
  type={popup.type}
  message={popup.message}
  actionText="OK"
  onAction={() => {
    setPopup({ show: false, type: "", message: "" });

    // ✅ ALWAYS redirect to Manual Attendance page
    window.location.href = "/student/cr/manual-attendance";
  }}
/>

    </div>
  );
}

export default CRManualAttendance;
