import { useState } from "react";
import Popup from "../../components/Popup";

function CRControl() {
  /* ================= MOCK STUDENTS (BACKEND LATER) ================= */
  const [students] = useState([
    { roll: "21AD001", name: "Arjun", isCR: false },
    { roll: "21AD002", name: "Meena", isCR: true },
    { roll: "21AD003", name: "Rahul", isCR: false },
  ]);

  /* ================= CURRENT CR ================= */
  const [currentCR, setCurrentCR] = useState({
    roll: "21AD002",
    name: "Meena",
    validFrom: "2025-06-01",
    validTo: "2025-12-31",
  });

  const [backupCR, setBackupCR] = useState(null);

  /* ================= FORM STATE ================= */
  const [selectedCR, setSelectedCR] = useState("");
  const [selectedBackup, setSelectedBackup] = useState("");
  const [validFrom, setValidFrom] = useState("");
  const [validTo, setValidTo] = useState("");

  const [popup, setPopup] = useState({
    type: "",
    message: "",
  });

  /* ================= ACTIONS ================= */

  const assignCR = () => {
    if (!selectedCR || !validFrom || !validTo) {
      setPopup({
        type: "error",
        message: "CR, validity start and end dates are required",
      });
      return;
    }

    const crStudent = students.find(
      (s) => s.roll === selectedCR
    );

    setCurrentCR({
      roll: crStudent.roll,
      name: crStudent.name,
      validFrom,
      validTo,
    });

    setPopup({
      type: "success",
      message: `CR assigned to ${crStudent.name}`,
    });

    setSelectedCR("");
    setValidFrom("");
    setValidTo("");
  };

  const assignBackupCR = () => {
    if (!selectedBackup) {
      setPopup({
        type: "error",
        message: "Select a backup CR",
      });
      return;
    }

    const backup = students.find(
      (s) => s.roll === selectedBackup
    );

    setBackupCR(backup);

    setPopup({
      type: "success",
      message: `Backup CR assigned to ${backup.name}`,
    });

    setSelectedBackup("");
  };

  const removeCR = () => {
    setCurrentCR(null);
    setBackupCR(null);

    setPopup({
      type: "success",
      message: "CR and Backup CR removed",
    });
  };

  /* ================= UI ================= */

  return (
    <div className="admin-page">
      <h2>CR Assignment & Control</h2>
      <p className="muted">
        Assign, replace and manage Class Representatives
      </p>

      {/* ================= CURRENT CR ================= */}
      <div className="admin-card">
        <h3>Current CR</h3>

        {currentCR ? (
          <div className="list-row">
            <div>
              <strong>{currentCR.roll}</strong> –{" "}
              {currentCR.name}
              <p className="muted">
                Valid: {currentCR.validFrom} →{" "}
                {currentCR.validTo}
              </p>
            </div>

            <span className="tag success">ACTIVE</span>
          </div>
        ) : (
          <p className="muted">No CR assigned</p>
        )}
      </div>

      {/* ================= BACKUP CR ================= */}
      <div className="admin-card">
        <h3>Backup CR</h3>

        {backupCR ? (
          <div className="list-row">
            <div>
              <strong>{backupCR.roll}</strong> –{" "}
              {backupCR.name}
            </div>
            <span className="tag warning">BACKUP</span>
          </div>
        ) : (
          <p className="muted">No backup CR assigned</p>
        )}
      </div>

      {/* ================= ASSIGN CR ================= */}
      <div className="admin-card">
        <h3>Assign / Replace CR</h3>

        <select
          value={selectedCR}
          onChange={(e) => setSelectedCR(e.target.value)}
        >
          <option value="">Select Student</option>
          {students.map((s) => (
            <option key={s.roll} value={s.roll}>
              {s.roll} – {s.name}
            </option>
          ))}
        </select>

        <div className="form-grid">
          <input
            type="date"
            value={validFrom}
            onChange={(e) => setValidFrom(e.target.value)}
          />
          <input
            type="date"
            value={validTo}
            onChange={(e) => setValidTo(e.target.value)}
          />
        </div>

        <button className="primary-btn" onClick={assignCR}>
          Assign CR
        </button>
      </div>

      {/* ================= ASSIGN BACKUP ================= */}
      <div className="admin-card">
        <h3>Assign Backup CR</h3>

        <select
          value={selectedBackup}
          onChange={(e) => setSelectedBackup(e.target.value)}
        >
          <option value="">Select Backup CR</option>
          {students.map((s) => (
            <option key={s.roll} value={s.roll}>
              {s.roll} – {s.name}
            </option>
          ))}
        </select>

        <button className="secondary-btn" onClick={assignBackupCR}>
          Assign Backup
        </button>
      </div>

      {/* ================= REMOVE ================= */}
      <div className="admin-card danger">
        <h3>Emergency Actions</h3>

        <button className="danger-btn" onClick={removeCR}>
          Remove CR & Backup
        </button>
      </div>

      {/* ================= POPUP ================= */}
      <Popup
        type={popup.type}
        message={popup.message}
        actionText="OK"
        onAction={() => setPopup({ type: "", message: "" })}
      />
    </div>
  );
}

export default CRControl;
