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
    
  ];

  const [odHistory, setOdHistory] = useState([]);
  const [absenceHistory, setAbsenceHistory] = useState([]);


  const [tab, setTab] = useState("daily");

  /* ===== FETCH DAILY REPORT + OD/ABSENCE HISTORY ===== */
  useEffect(() => {
    const fetchDailyReport = async () => {
      try {
        const res = await api.get("/students/attendance/daily/report");
        setTotalDays(res.data.total_days);
        setPresentDays(res.data.present_days);
        setAttendancePercent(res.data.percentage);
        setDailyHistory(res.data.daily_history || []);
      } catch (err) {
        console.error("Daily report fetch failed", err);
      }
    };

    const fetchODAndAbsenceHistory = async () => {
      try {
        const [odRes, absRes] = await Promise.all([
          api.get("/students/od/history"),
          api.get("/students/absent/history"),
        ]);
        setOdHistory(odRes.data.requests || []);
        setAbsenceHistory(absRes.data.requests || []);
      } catch (err) {
        // If backend endpoints don't exist yet, keep empty histories.
        console.warn("OD/Absence history fetch failed", err);
      }
    };

    fetchDailyReport();
    fetchODAndAbsenceHistory();
  }, []);


  /* ===== LEAVE CALCULATION (NEW) ===== */
  const leaveTaken = totalDays - presentDays;
  const remainingLeave = Math.max(0, 18 - leaveTaken);

  const formatDate = (dateInput) => {
    if (!dateInput) return "";
    // Normalize strings like '2026-05-16' or '2026-05-16T00:00:00'
    try {
      const d = new Date(dateInput);
      if (!isNaN(d)) {
        const day = String(d.getDate()).padStart(2, "0");
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const year = d.getFullYear();
        return `${day}-${month}-${year}`;
      }
    } catch (e) {
      // fallthrough
    }

    // Fallback for plain 'YYYY-MM-DD' strings
    const raw = String(dateInput).split("T")[0];
    const parts = raw.split("-");
    if (parts.length >= 3) {
      return `${parts[2].padStart(2, "0")}-${parts[1].padStart(2, "0")}-${parts[0]}`;
    }

    return String(dateInput);
  };

const getRequestStatus = (status) => {
    const normalized = (status || "").toUpperCase();

    if (normalized === "PENDING") {
      return {
        label: "CR Verification Pending",
        className: "pending",
      };
    }

    if (normalized === "APPROVED") {
      return {
        label: "Approved",
        className: "approved",
      };
    }

    if (normalized === "REJECTED") {
      return {
        label: "Rejected",
        className: "rejected",
      };
    }

    return {
      label: status || "Unknown",
      className: "neutral",
    };
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

      {/* ===== OD APPLICATION HISTORY (BACKEND) ===== */}
      <div className="subject-report">
        <h3>Status of Applied OD</h3>

        <div className="history-list">
          {odHistory.length === 0 ? (
            <p className="muted">No OD requests found.</p>
          ) : (
            odHistory.map((od, i) => {
              const status = getRequestStatus(od.status);

              return (
              <div key={i} className="history-card request-history-card od-request-card">
                <div className="request-history-main">
                <div className="request-history-info">
                  <strong>{formatDate(od.date || od.request_date)}</strong>
                  <p>
                    {od.category}
                    {od.slots ? ` • ${od.slots}` : ""}
                  </p>
                </div>

                <span className={`request-status ${status.className}`}>
                  {status.label}
                </span>
                </div>

                {(od.proof_url || od.cr_remarks) && (
                  <div className="history-meta">
                    {od.proof_url && (
                      <a
                        className="proof-link"
                        href={od.proof_url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View Proof
                      </a>
                    )}
                    {od.cr_remarks && (
                      <p className="muted" style={{ marginTop: 6 }}>
                        CR Remarks: {od.cr_remarks}
                      </p>
                    )}
                  </div>
                )}

              </div>
              );
            })
          )}
        </div>
      </div>

      {/* ===== ABSENCE APPLICATION HISTORY (BACKEND) ===== */}
      <div className="subject-report">
        <h3>Status of Applied Absence</h3>

        <div className="history-list">
          {absenceHistory.length === 0 ? (
            <p className="muted">No absence requests found.</p>
          ) : (
            absenceHistory.map((ab, i) => {
              const status = getRequestStatus(ab.status);

              return (
              <div key={i} className="history-card request-history-card absence-request-card">
                <div className="request-history-main">
                <div className="request-history-info">
                  <strong>{formatDate(ab.date || ab.request_date)}</strong>
                  <p>
                    {ab.category}
                    {ab.slots ? ` • ${ab.slots}` : ""}
                  </p>
                </div>

                <span className={`request-status ${status.className}`}>
                  {status.label}
                </span>
                </div>

                {(ab.proof_url || ab.cr_remarks) && (
                  <div className="history-meta">
                    {ab.proof_url && (
                      <a
                        className="proof-link"
                        href={ab.proof_url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View Proof
                      </a>
                    )}
                    {ab.cr_remarks && (
                      <p className="muted" style={{ marginTop: 6 }}>
                        CR Remarks: {ab.cr_remarks}
                      </p>
                    )}
                  </div>
                )}
              </div>
              );
            })
          )}
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
                    item.status === "Present"
                      ? "present"
                      : item.status === "OD" || item.status === "OD (Approved)"
                        ? "od"
                        : item.status === "Absent" || item.status === "Absent (Approved)"
                          ? "absent"
                          : "absent"
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
