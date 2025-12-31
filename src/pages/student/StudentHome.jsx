import {
  FaCheckCircle,
  FaQrcode,
  FaChartBar,
  FaExclamationCircle,
  FaInfoCircle,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../api/api";

function StudentHome() {
  const navigate = useNavigate();

  const [student, setStudent] = useState(null);
  const [attendanceStatus, setAttendanceStatus] = useState("Loading...");

useEffect(() => {
  const fetchAttendance = async () => {
    try {
      const res = await api.get("/students/attendance/today", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setAttendanceStatus(res.data.status);
    } catch {
      setAttendanceStatus("Error");
    }
  };

  fetchAttendance();
}, []);
  const [loading, setLoading] = useState(true);

  /* ================= FETCH STUDENT PROFILE ================= */
  useEffect(() => {
    api
      .get("/students/student/me", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        setStudent(res.data);
      })
      .catch(() => {
        console.error("Failed to load student profile");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const getStatusColor = () => {
    if (attendanceStatus === "Present") return "#22c55e";
    if (attendanceStatus === "Absent") return "#ef4444";
    return "#f59e0b";
  };

  if (loading) {
    return <div className="page">Loading...</div>;
  }

  return (
    <div className="student-home">
      {/* HEADER */}
      <div className="student-home-header">
        <div>
          <h2>Welcome, {student.name} 👋</h2>
          <p className="muted">{student.roll_number}</p>
        </div>
      </div>

      {/* DATE – CLEAR & HIGHLIGHTED */}
      <div className="date-chip">
        {new Date().toDateString()}
      </div>

      {/* TODAY STATUS */}
      <div className="status-card">
        <span className="status-label">Today’s Attendance</span>
        <span
          className="status-pill"
          style={{
            backgroundColor: getStatusColor() + "20",
            color: getStatusColor(),
          }}
        >
          {attendanceStatus}
        </span>
      </div>

      {/* QUICK ACTIONS */}
      <div className="quick-actions">
        <div
          className="action-card"
          onClick={() => navigate("/student/attendance")}
        >
          <FaCheckCircle />
          <span>Mark Attendance</span>
        </div>

        <div
          className="action-card"
          onClick={() => navigate("/student/qr")}
        >
          <FaQrcode />
          <span>My QR</span>
        </div>

        <div
          className="action-card"
          onClick={() => navigate("/student/reports")}
        >
          <FaChartBar />
          <span>Attendance Report</span>
        </div>

        <div
          className="action-card"
          onClick={() => navigate("/student/grievance")}
        >
          <FaExclamationCircle />
          <span>Raise Grievance</span>
        </div>

        <div
          className="action-card"
          onClick={() => navigate("/student/credits")}
        >
          <FaInfoCircle />
          <span>Credits</span>
        </div>
      </div>
    </div>
  );
}

export default StudentHome;
