import { useState } from "react";
import {
  FaQrcode,
  FaCalendarTimes,
  FaClipboardList,
} from "react-icons/fa";

import QrScannerModal from "../../components/QrScannerModal";
import DeclareAbsentModal from "../../components/DeclareAbsentModal";
import ApplyODModal from "../../components/ApplyODModal";

function Attendance() {
  const [showScanner, setShowScanner] = useState(false);
  const [showAbsent, setShowAbsent] = useState(false);
  const [showOD, setShowOD] = useState(false);

  const [slots] = useState([
    { slot: "Slot 1", subject: "DBMS", status: "Present" },
    { slot: "Slot 2", subject: "AI", status: "Not Marked" },
    { slot: "Slot 3", subject: "OOPS", status: "Absent" },
    { slot: "Slot 4", subject: "DPCO", status: "OD" },
  ]);

  const getStatusColor = (status) => {
    if (status === "Present") return "#22c55e";
    if (status === "Absent") return "#ef4444";
    if (status === "OD") return "#3b82f6";
    return "#f59e0b";
  };

  const handleAbsentSubmit = (data) => {
    console.log("ABSENT DECLARED:", data);
    // modal will close via popup OK
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
        <span className="summary-pill">In Progress</span>
      </div>

      {/* SLOT LIST */}
      <div className="slot-list">
        {slots.map((slot, index) => (
          <div key={index} className="slot-card">
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
              {slot.status}
            </span>
          </div>
        ))}
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
          onScan={() => setShowScanner(false)}
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
        <ApplyODModal onClose={() => setShowOD(false)} />
      )}
    </div>
  );
}

export default Attendance;
