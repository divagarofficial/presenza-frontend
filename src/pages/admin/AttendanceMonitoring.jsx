import { useState, useEffect } from "react";
import {
  FaFilePdf,
  FaFileExcel,
  FaCalendarTimes,
} from "react-icons/fa";
import Popup from "../../components/Popup";
import api from "../../api/api";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import minduraLogo from "../../assets/mindura-logo.png";
import presenzaLogo from "../../assets/presenza-logo.png";

/* ================= ADMIN META ================= */
const getAdminMeta = () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) return {};
    const payload = JSON.parse(atob(token.split(".")[1]));
    return {
      department: payload.department,
      year: payload.year,
      section: payload.section,
    };
  } catch {
    return {};
  }
};

function AttendanceMonitoring() {
  const [tab, setTab] = useState("daily");
  const [dailyAttendance, setDailyAttendance] = useState([]);
  const [slotAttendance, setSlotAttendance] = useState([]);
  const [loading, setLoading] = useState(false);

  const [popup, setPopup] = useState({ type: "", message: "" });

  const loadImage = (src) =>
    new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.src = src;
    });

  const loadDailyAttendance = async () => {
    const res = await api.get("/admin/attendance/daily");
    setDailyAttendance(res.data);
  };

  const loadSlotAttendance = async () => {
    const res = await api.get("/admin/attendance/slots");
    setSlotAttendance(res.data);
  };

  const loadAll = async () => {
    try {
      setLoading(true);
      await Promise.all([loadDailyAttendance(), loadSlotAttendance()]);
    } catch {
      setPopup({ type: "error", message: "Failed to load attendance data" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
    const interval = setInterval(loadAll, 30000);
    return () => clearInterval(interval);
  }, []);

  const getStatusClass = (status) => {
    if (status === "Present") return "status present";
    if (status === "Absent") return "status absent";
    return "status warning";
  };

  /* ================= PDF EXPORT ================= */
  const exportPDF = async () => {
    try {
      const res = await api.get("/admin/attendance/report");
      const { department, year, section } = getAdminMeta();

      const doc = new jsPDF("landscape");
      const minduraImg = await loadImage(minduraLogo);
      const presenzaImg = await loadImage(presenzaLogo);

      /* ===== HEADER ===== */
      doc.addImage(minduraImg, "PNG", 130, 10, 30, 30);

      doc.setFont("helvetica", "bold");
      doc.setFontSize(18);
      doc.text("MINDURA TECHNOLOGIES", 148, 48, { align: "center" });

      doc.setFontSize(11);
      doc.setFont("helvetica", "normal");
      doc.text(
        `Department : ${department || "-"}    Year : ${year || "-"}    Section : ${section || "-"}`,
        148,
        56,
        { align: "center" }
      );

      doc.text(
        `Date : ${new Date().toLocaleDateString()}`,
        148,
        62,
        { align: "center" }
      );

      /* ===== WATERMARK ===== */
      doc.setGState(new doc.GState({ opacity: 0.07 }));
      doc.addImage(presenzaImg, "PNG", 90, 70, 120, 120);
      doc.setGState(new doc.GState({ opacity: 1 }));

      /* ===== TABLE ===== */
      autoTable(doc, {
        startY: 75,
        head: [[
          "Roll Number",
          "Name",
          "Working Days",
          "Present Days",
          "Attendance %",
        ]],
        body: res.data.map((s) => [
          s.roll,
          s.name,
          s.working_days,
          s.present_days,
          s.percentage + "%",
        ]),
        styles: { fontSize: 10, halign: "center" },
        headStyles: { fillColor: [30, 30, 30], textColor: [255, 255, 255] },
        didParseCell: (data) => {
          if (
            data.column.index === 4 &&
            parseFloat(data.cell.text[0]) < 75
          ) {
            data.cell.styles.textColor = [255, 0, 0];
            data.cell.styles.fontStyle = "bold";
          }
        },
      });

      /* ===== FOOTER ===== */
      const h = doc.internal.pageSize.height;
      doc.setFontSize(10);
      doc.text(
        `Report generated on : ${new Date().toLocaleString()}`,
        148,
        h - 30,
        { align: "center" }
      );
      doc.setFont("helvetica", "bold");
      doc.text("MINDURA TECHNOLOGIES", 148, h - 24, { align: "center" });
      doc.setFont("helvetica", "normal");
      doc.text(
        "© 2026 MINDURA TECHNOLOGIES. All rights reserved.",
        148,
        h - 18,
        { align: "center" }
      );

      doc.save("attendance_report.pdf");

      setPopup({ type: "success", message: "Attendance report exported successfully" });
    } catch {
      setPopup({ type: "error", message: "Failed to export attendance report" });
    }
  };

  const exportExcel = () =>
    setPopup({ type: "warning", message: "Excel export will be enabled soon" });

  const declareHoliday = () =>
    setPopup({ type: "warning", message: "Holiday declaration will be enabled soon" });

  return (
    <div className="admin-page">
      <h2>Attendance Monitoring</h2>
      <p className="muted">Live section-wise attendance overview</p>

      <div className="admin-actions spaced">
        <button className="danger-btn" onClick={declareHoliday}>
          <FaCalendarTimes /> Declare Holiday
        </button>
        <div className="export-actions">
          <button className="secondary-btn" onClick={exportPDF}>
            <FaFilePdf /> Export PDF
          </button>
          <button className="secondary-btn" onClick={exportExcel}>
            <FaFileExcel /> Export Excel
          </button>
        </div>
      </div>

      <div className="history-tabs">
        <button className={tab === "daily" ? "active" : ""} onClick={() => setTab("daily")}>
          Daily Attendance
        </button>
        <button className={tab === "slot" ? "active" : ""} onClick={() => setTab("slot")}>
          Slot Attendance
        </button>
      </div>

      {tab === "daily" && (
        <div className="admin-card">
          <h3>Daily Attendance (Today)</h3>
          {loading && <p className="muted">Refreshing...</p>}
          {dailyAttendance.map((s, i) => (
            <div key={i} className="daily-attendance-card">
              <div className="row-top">
                <div>
                  <strong>{s.roll}</strong>
                  <p className="muted">{s.name}</p>
                </div>
                <span className={getStatusClass(s.status)}>{s.status}</span>
              </div>
              <div className="row-bottom">
                <span className="source-chip">{s.source}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      <Popup
        type={popup.type}
        message={popup.message}
        actionText="OK"
        onAction={() => setPopup({ type: "", message: "" })}
      />
    </div>
  );
}

export default AttendanceMonitoring;
