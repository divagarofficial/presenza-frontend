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
    const res = await api.get(
      `/cr/attendance/daily/export/${type}/pdf`,
      { responseType: "blob" }
    );

    const contentType = res.headers["content-type"];
    if (!contentType || !contentType.includes("application/pdf")) {
      alert("Export failed. Please login again.");
      return;
    }

    const url = window.URL.createObjectURL(
      new Blob([res.data], { type: "application/pdf" })
    );

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
  <div key={i} className="cr-student-row single-line">
    <span className="student-text">
      <strong>{s.roll_number}</strong> - {s.name}
    </span>
    <span className="present-time">{s.time}</span>
  </div>
))}

    </div>
  );
}

export default CRScanAttendance;
