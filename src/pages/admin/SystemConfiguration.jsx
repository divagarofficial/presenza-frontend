import { useState } from "react";
import {
  FaClock,
  FaQrcode,
  FaClipboardList,
  FaExclamationTriangle,
  FaSave,
} from "react-icons/fa";

function SystemConfiguration() {
  const [config, setConfig] = useState({
    attendanceStart: "08:30",
    attendanceEnd: "17:00",

    qrInterval: 2,

    odRules: {
      maxOD: 10,
      allowSlotWise: true,
    },

    grievanceDeadline: 7,
  });

  const handleSave = () => {
    console.log("SYSTEM CONFIG:", config);
    alert("System configuration saved (backend later)");
  };

  return (
    <div className="admin-page">
      <h2>System Configuration</h2>
      <p className="muted">
        Control global attendance, QR, OD and grievance rules
      </p>

      {/* ===== DAILY ATTENDANCE WINDOW ===== */}
      <div className="config-card">
        <h3>
          <FaClock /> Daily Attendance Window
        </h3>

        <div className="config-row">
          <label>Start Time</label>
          <input
            type="time"
            value={config.attendanceStart}
            onChange={(e) =>
              setConfig({ ...config, attendanceStart: e.target.value })
            }
          />
        </div>

        <div className="config-row">
          <label>End Time</label>
          <input
            type="time"
            value={config.attendanceEnd}
            onChange={(e) =>
              setConfig({ ...config, attendanceEnd: e.target.value })
            }
          />
        </div>
      </div>

      {/* ===== QR CONFIG ===== */}
      <div className="config-card">
        <h3>
          <FaQrcode /> QR Configuration
        </h3>

        <div className="config-row">
          <label>QR Refresh Interval (seconds)</label>
          <input
            type="number"
            min="1"
            value={config.qrInterval}
            onChange={(e) =>
              setConfig({
                ...config,
                qrInterval: Number(e.target.value),
              })
            }
          />
        </div>
      </div>

      {/* ===== OD RULES ===== */}
      <div className="config-card">
        <h3>
          <FaClipboardList /> OD Rules
        </h3>

        <div className="config-row">
          <label>Maximum OD per Semester</label>
          <input
            type="number"
            min="0"
            value={config.odRules.maxOD}
            onChange={(e) =>
              setConfig({
                ...config,
                odRules: {
                  ...config.odRules,
                  maxOD: Number(e.target.value),
                },
              })
            }
          />
        </div>

        <div className="config-row checkbox">
          <input
            type="checkbox"
            checked={config.odRules.allowSlotWise}
            onChange={(e) =>
              setConfig({
                ...config,
                odRules: {
                  ...config.odRules,
                  allowSlotWise: e.target.checked,
                },
              })
            }
          />
          <label>Allow Slot-wise OD</label>
        </div>
      </div>

      {/* ===== GRIEVANCE RULES ===== */}
      <div className="config-card">
        <h3>
          <FaExclamationTriangle /> Grievance Rules
        </h3>

        <div className="config-row">
          <label>Grievance Deadline (days)</label>
          <input
            type="number"
            min="1"
            value={config.grievanceDeadline}
            onChange={(e) =>
              setConfig({
                ...config,
                grievanceDeadline: Number(e.target.value),
              })
            }
          />
        </div>
      </div>

      {/* ===== SAVE ===== */}
      <button className="primary-btn full" onClick={handleSave}>
        <FaSave /> Save Configuration
      </button>
    </div>
  );
}

export default SystemConfiguration;
