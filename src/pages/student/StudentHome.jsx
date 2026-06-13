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
  const [loading, setLoading] = useState(true);

  const [announcements, setAnnouncements] = useState([]);
  const [semesterEndDate, setSemesterEndDate] = useState(null);
  const [daysLeft, setDaysLeft] = useState(null);

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

  // Holidays + semester info to show on home page (student dashboard)
  useEffect(() => {
    const loadAnnouncements = async () => {
      try {
        const res = await api.get("/students/home/announcements", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        setAnnouncements(res.data.announcements || []);
        setSemesterEndDate(res.data.semester_end_date || null);
        setDaysLeft(typeof res.data.days_left === "number" ? res.data.days_left : null);
      } catch {
        setAnnouncements([]);
        setSemesterEndDate(null);
        setDaysLeft(null);
      }
    };

    loadAnnouncements();
  }, []);

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
    if (attendanceStatus === "PRESENT") return "#22c55e";
    if (attendanceStatus === "Absent") return "#ef4444";
    return "#f59e0b";
  };

  if (loading) {
    return <div className="page">Loading...</div>;
  }

  // Ensure nearest upcoming holiday is on top (client-side safety)
  const sortedAnnouncements = [...announcements].sort(
    (a, b) => new Date(a.holiday_date + "T00:00:00") - new Date(b.holiday_date + "T00:00:00")
  );

  return (
    <div className="student-home">
      {/* HEADER */}
      <div className="student-home-header">
        <div>
          <h2>
            Welcome, {student.name}{" "}
          </h2>
          <p className="muted">{student.roll_number}</p>
        </div>
      </div>

      {/* DATE – CLEAR & HIGHLIGHTED */}
      <div className="date-chip">{new Date().toDateString()}</div>

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

        <div className="action-card" onClick={() => navigate("/student/qr")}
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

      {/* ANNOUNCEMENTS */}
      <div className="announcements-section" style={{ marginTop: "1.25rem" }}>
        <h3 style={{ margin: "0 0 0.5rem" }}>Announcements</h3>

        {sortedAnnouncements.length === 0 ? (
          <p className="muted" style={{ margin: 0 }}>
            No announcements
          </p>
        ) : (
          <div style={{ display: "grid", gap: "0.75rem" }}>
            {sortedAnnouncements.map((a, idx) => (
              <div
                key={a?.holiday_date || idx}
                className="announcement-card"
                style={{
                  background: "#fef3c7",
                  border: "1px solid #fde68a",
                  borderRadius: 12,
                  padding: "0.75rem 0.9rem",
                }}
              >
                <div style={{ fontWeight: 700, marginBottom: 4 }}>
                  Holiday declared on{" "}
                  {new Date(a.holiday_date + "T00:00:00").toLocaleDateString(
                    "en-GB"
                  )}
                </div>

                {a.reason ? (
                  <div style={{ color: "#92400e" }}>Reason: {a.reason}</div>
                ) : (
                  <div style={{ color: "#92400e" }}>Reason not provided</div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* SEMESTER ENDS CARD (bottom of announcements) */}
        <div
          style={{
            marginTop: "1rem",
            background: "linear-gradient(135deg, #0ea5e9 0%, #22c55e 100%)",
            borderRadius: 16,
            padding: "0.95rem 1rem",
            border: "1px solid rgba(255,255,255,0.35)",
            boxShadow: "0 18px 36px rgba(34,197,94,0.22)",
            color: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
          }}
        >
          <div>
            <div style={{ fontSize: 12, opacity: 0.9, letterSpacing: 0.2 }}>
              Semester status
            </div>
            <div style={{ fontWeight: 800, fontSize: 16 }}>
              Semester ends in {daysLeft ?? "—"} days
            </div>
            {semesterEndDate ? (
              <div style={{ fontSize: 12, opacity: 0.92, marginTop: 2 }}>
                Ends on{" "}
                {new Date(semesterEndDate + "T00:00:00").toLocaleDateString(
                  "en-GB"
                )}
              </div>
            ) : null}
          </div>

          <div
            style={{
              background: "rgba(255,255,255,0.18)",
              border: "1px solid rgba(255,255,255,0.25)",
              borderRadius: 14,
              padding: "0.65rem 0.8rem",
              minWidth: 92,
              textAlign: "center",
              fontWeight: 900,
            }}
          >
            {daysLeft === 0
              ? "TODAY"
              : daysLeft !== null && daysLeft !== undefined
                ? "D-" + daysLeft
                : "—"}
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentHome;

