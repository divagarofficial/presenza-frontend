import { useState, useEffect } from "react";
import api from "../../api/api";

function Reports() {
  /* ===== BACKEND: DAILY ATTENDANCE ===== */
  const [totalDays, setTotalDays] = useState(0);
  const [presentDays, setPresentDays] = useState(0);
  const [attendancePercent, setAttendancePercent] = useState(0);
  const [dailyHistory, setDailyHistory] = useState([]);

  /* ===== MOCK DATA (KEEP AS IS) ===== */
  const subjects = [
    
  ];

  const slotHistory = [
    {
      date: "2025-12-01",
      slot: "Slot 2",
      subject: "AI",
      status: "Absent",
    },
    {
      date: "2025-12-05",
      slot: "Slot 4",
      subject: "DBMS",
      status: "OD",
    },
  ];

  const odHistory = [
    {
      date: "2025-12-03",
      category: "Full Day",
      status: "Pending",
    },
    {
      date: "2025-12-07",
      category: "Slot-wise",
      slot: "Slot 3",
      status: "Approved",
    },
    {
      date: "2025-12-12",
      category: "Slot-wise",
      slot: "Slot 2",
      status: "Rejected",
    },
  ];

  const [tab, setTab] = useState("daily");

  /* ===== FETCH DAILY REPORT ===== */
  useEffect(() => {
    const fetchDailyReport = async () => {
      try {
        const res = await api.get(
          "/students/attendance/daily/report"
        );

        setTotalDays(res.data.total_days);
        setPresentDays(res.data.present_days);
        setAttendancePercent(res.data.percentage);
        setDailyHistory(res.data.daily_history || []);
      } catch (err) {
        console.error("Daily report fetch failed", err);
      }
    };

    fetchDailyReport();
  }, []);

  /* ===== LEAVE CALCULATION (NEW) ===== */
  const leaveTaken = totalDays - presentDays;
  const remainingLeave = Math.max(0, 18 - leaveTaken);

  const formatDate = (dateStr) => {
    const [y, m, d] = dateStr.split("-");
    return `${d}-${m}-${y}`;
  };

  return (
    <div className="reports-page">
      {/* ===== OVERVIEW ===== */}
      <div className="report-summary-card">
        <h3>Attendance Overview</h3>

        <div className="summary-percentage">
          <span className="big">{attendancePercent}%</span>
          <p>
            {presentDays} / {totalDays} Days Present
          </p>
        </div>
      </div>

      {/* ===== REMAINING LEAVE (NEW SECTION) ===== */}
      <div className="report-summary-card">
        <h3>Remaining Leave</h3>

        <div className="summary-percentage">
          <span
            className="big"
            style={{
              color: remainingLeave <= 3 ? "#ef4444" : "#22c55e",
            }}
          >
            {remainingLeave}
          </span>
          <p>Days left</p>
        </div>
      </div>

      {/* ===== SUBJECT WISE (MOCK) ===== */}
      <div className="subject-report">
        <h3>Subject-wise Attendance</h3>

        {subjects.map((sub) => (
          <div key={sub.name} className="subject-row">
            <div className="subject-info">
              <span>{sub.name}</span>
              <span>{sub.percent}%</span>
            </div>

            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${sub.percent}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* ===== OD APPLICATION HISTORY (MOCK) ===== */}
      <div className="subject-report">
        <h3>Status of Applied OD</h3>

        <div className="history-list">
          {odHistory.map((od, i) => (
            <div key={i} className="history-card">
              <div>
                <strong>{formatDate(od.date)}</strong>
                <p>
                  {od.category}
                  {od.slot ? ` • ${od.slot}` : ""}
                </p>
              </div>

              <span
                className={`status ${
                  od.status === "Approved"
                    ? "od"
                    : od.status === "Rejected"
                    ? "absent"
                    : ""
                }`}
                style={
                  od.status === "Pending"
                    ? { color: "#f59e0b", fontWeight: 700 }
                    : {}
                }
              >
                {od.status === "Pending"
                  ? "CR Verification Pending"
                  : od.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ===== HISTORY ===== */}
      <div className="history-section">
        <div className="history-tabs">
          <button
            className={tab === "daily" ? "active" : ""}
            onClick={() => setTab("daily")}
          >
            Daily History
          </button>

          <button
            className={tab === "slot" ? "active" : ""}
            onClick={() => setTab("slot")}
          >
            Slot-wise History
          </button>
        </div>

        {/* DAILY (BACKEND) */}
        {tab === "daily" && (
          <div className="history-list">
            {dailyHistory.map((item, i) => (
              <div key={i} className="history-card">
                <div>
                  <strong>{formatDate(item.date)}</strong>
                  <p>{item.source}</p>
                </div>

                <span
                  className={`status ${
                    item.status === "OD" ? "od" : "absent"
                  }`}
                >
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* SLOT (MOCK) */}
        {tab === "slot" && (
          <div className="history-list">
            {slotHistory.map((item, i) => (
              <div key={i} className="history-card">
                <div>
                  <strong>{formatDate(item.date)}</strong>
                  <p>
                    {item.slot} • {item.subject}
                  </p>
                </div>

                <span
                  className={`status ${
                    item.status === "OD" ? "od" : "absent"
                  }`}
                >
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Reports;
