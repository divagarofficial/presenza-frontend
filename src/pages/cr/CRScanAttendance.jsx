import { useEffect, useState } from "react";
import { FaQrcode, FaUsers, FaDownload } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";

function CRScanAttendance() {
  const navigate = useNavigate();

  const [present, setPresent] = useState([]);
  const [absent, setAbsent] = useState([]);

  /* ---------------- FETCH DATA ---------------- */
  const fetchData = async () => {
    try {
      const [pRes, aRes] = await Promise.all([
        api.get("/cr/attendance/daily/today"),
        api.get("/cr/attendance/daily/absent"),
      ]);

      setPresent(pRes.data.scanned || []);
      setAbsent(aRes.data.absent || []);
    } catch (err) {
      console.error("Attendance fetch failed", err);
    }
  };

  /* ---------------- LIVE AUTO REFRESH ---------------- */
  useEffect(() => {
    fetchData();
    const timer = setInterval(fetchData, 5000);
    return () => clearInterval(timer);
  }, []);

  /* ---------------- PDF DOWNLOAD (FIXED & SAFE) ---------------- */
  const downloadPDF = async (type) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Session expired. Please login again.");
        return;
      }

      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/cr/attendance/daily/export/${type}/pdf`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        const text = await res.text();
        console.error("PDF EXPORT FAILED:", text);
        alert("Failed to export PDF");
        return;
      }

      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/pdf")) {
        const text = await res.text();
        console.error("NOT A PDF RESPONSE:", text);
        alert("Export failed. Please login again and retry.");
        return;
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `${type}_attendance_${new Date()
        .toISOString()
        .slice(0, 10)}.pdf`;

      document.body.appendChild(a);
      a.click();

      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("PDF DOWNLOAD ERROR:", err);
      alert("Failed to download PDF");
    }
  };

  return (
    <div className="cr-scan-page">
      <h2>Daily Attendance</h2>

      {/* SUMMARY */}
      <div className="cr-summary">
        <div className="summary-card">
          <FaUsers />
          <div>
            <strong>{present.length}</strong>
            <p>Present</p>
          </div>
        </div>

        <div className="summary-card">
          <FaUsers />
          <div>
            <strong>{absent.length}</strong>
            <p>Absent</p>
          </div>
        </div>
      </div>

      {/* ACTIONS */}
      <div className="cr-actions">
        <button
          className="primary-btn"
          onClick={() => navigate("/student/cr/scan")}
        >
          <FaQrcode /> Start Scanning
        </button>

        <button
          className="secondary-btn"
          onClick={() => downloadPDF("present")}
        >
          <FaDownload /> Export Present PDF
        </button>

        <button
          className="secondary-btn"
          onClick={() => downloadPDF("absent")}
        >
          <FaDownload /> Export Absent PDF
        </button>
      </div>

      {/* PRESENT LIST */}
      <h3>Present Students</h3>

      {present.length === 0 && (
        <p className="muted">No students marked present yet</p>
      )}

      {present.map((s, i) => (
        <div key={i} className="cr-student-row">
          <span>
            <strong>{s.roll_number}</strong> – {s.name}
          </span>
          <span className="present">{s.time}</span>
        </div>
      ))}
    </div>
  );
}

export default CRScanAttendance;
