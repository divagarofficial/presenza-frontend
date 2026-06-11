import { useState, useEffect, useCallback } from "react";
import {
  FaQrcode,
  FaCalendarTimes,
  FaClipboardList,
} from "react-icons/fa";

import QrScannerModal from "../../components/QrScannerModal";
import DeclareAbsentModal from "../../components/DeclareAbsentModal";
import ApplyODModal from "../../components/ApplyODModal";
import api from "../../api/api";


function Attendance() {
  const [showScanner, setShowScanner] = useState(false);
  const [showAbsent, setShowAbsent] = useState(false);
  const [showOD, setShowOD] = useState(false);

  const [slots, setSlots] = useState([]);
  const [summary, setSummary] = useState("In Progress");
  const [loadError, setLoadError] = useState("");

  const loadToday = useCallback(async () => {
    try {
      setLoadError("");
      const res = await api.get("/students/attendance/today/detail");
      setSlots(res.data.slots || []);
      setSummary(res.data.summary || "In Progress");
    } catch {
      setLoadError("Could not load today’s attendance");
      setSlots([]);
    }
  }, []);

  useEffect(() => {
    loadToday();
  }, [loadToday]);

  const getStatusColor = (status) => {
    if (status === "Present") return "#22c55e";
    if (status === "Absent") return "#ef4444";
    if (status === "OD") return "#3b82f6";
    if (status === "OD (Approved)") return "#3b82f6";
    if (status === "Absent (Approved)") return "#ef4444";
    return "#f59e0b";
  };

  const getApprovalLabel = (status) => {
    if (status === "OD") return "OD (Approved)";
    if (status === "Absent") return "Absent (Approved)";
    return status;
  };

  const handleAbsentSubmit = async (payload) => {
    const token = localStorage.getItem("token");

    const form = new FormData();
    form.append("category", payload.category);
    if (payload.slots && payload.category === "slot") {
      form.append("slots", payload.slots.join(","));
    }
    form.append("reason", payload.reason);
    if (payload.proof) {
      form.append("proof", payload.proof);
    }

    await api.post("/students/absent/declare", form, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
    await loadToday();
  };

  const handleODSubmit = async (payload) => {
    const token = localStorage.getItem("token");

    const form = new FormData();
    form.append("category", payload.category);
    if (payload.slots && payload.category === "slot") {
      form.append("slots", payload.slots.join(","));
    }
    form.append("reason", payload.reason);
    form.append("proof", payload.proof);

    await api.post("/students/od/apply", form, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
    await loadToday();
  };

  return (
    <div className="attendance-page">
      {/* HEADER */}
      <div className="attendance-header">
        <h2>Attendance</h2>
        <div className="date-chip">
          {new Date().toDateString()}
        </div>
      </div>

      {/* SUMMARY */}
      <div className="attendance-summary">
        <span>Today’s Status</span>
        <span className="summary-pill">{summary}</span>
      </div>
      {loadError && (
        <p className="muted" style={{ marginBottom: "0.75rem" }}>
          {loadError}
        </p>
      )}

      {/* SLOT LIST */}
      <div className="slot-list">
        {slots.length === 0 && !loadError ? (
          <p className="muted">No timetable slots for today.</p>
        ) : (
          slots.map((slot, index) => (
            <div key={`${slot.slot}-${index}`} className="slot-card">
              <div>
                <h4>{slot.slot}</h4>
                <p>{slot.subject}</p>
              </div>

              <span
                className="status-pill"
                style={{
                  backgroundColor: getStatusColor(slot.status) + "20",
                  color: getStatusColor(slot.status),
                }}
              >
                {getApprovalLabel(slot.status)}
              </span>
            </div>
          ))
        )}
      </div>

      {/* ACTIONS */}
      <div className="attendance-actions">
        <button
          className="primary-btn"
          onClick={() => setShowScanner(true)}
        >
          <FaQrcode /> Scan QR
        </button>

        <button
          className="secondary-btn"
          onClick={() => setShowAbsent(true)}
        >
          <FaCalendarTimes /> Declare Absent
        </button>

        <button
          className="secondary-btn"
          onClick={() => setShowOD(true)}
        >
          <FaClipboardList /> Apply OD
        </button>
      </div>

      {/* MODALS */}
      {showScanner && (
        <QrScannerModal
          onClose={() => setShowScanner(false)}
          onScan={() => {
            setShowScanner(false);
            loadToday();
          }}
        />
      )}

      {showAbsent && (
        <DeclareAbsentModal
          slots={slots}
          onClose={() => setShowAbsent(false)}
          onSubmit={handleAbsentSubmit}
        />
      )}

      {showOD && (
        <ApplyODModal
          onClose={() => setShowOD(false)}
          onSubmit={handleODSubmit}
        />
      )}
    </div>
  );
}

export default Attendance;
