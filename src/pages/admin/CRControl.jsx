import { useEffect, useState } from "react";
import Popup from "../../components/Popup";

import api from "../../api/api";

function CRControl() {
  /* ================= DATA LOADING ================= */
  const [students, setStudents] = useState([]);
  const [currentCR, setCurrentCR] = useState(null);
  const [backupCR, setBackupCR] = useState(null);
  const [adminScope, setAdminScope] = useState(null);


  /* ================= FORM STATE ================= */
  const [selectedCR, setSelectedCR] = useState("");
  const [selectedBackup, setSelectedBackup] = useState("");
  const [validFrom, setValidFrom] = useState("");
  const [validTo, setValidTo] = useState("");

  const [loading, setLoading] = useState(false);

  const [popup, setPopup] = useState({
    type: "",
    message: "",
  });



  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        window.location.href = "/admin/login";
        return;
      }

      // Backend will validate admin JWT; avoids any client-side token staleness issues.
      const adminRes = await api.get("/admin/me");
      setAdminScope(adminRes.data || null);



      const crRes = await api.get("/admin/cr-control");

      const studentsRes = await api.get("/admin/students");





      const cr = crRes.data || {};
      setCurrentCR(cr.current || null);
      setBackupCR(cr.backup || null);

      const list = Array.isArray(studentsRes.data?.students)
        ? studentsRes.data.students
        : Array.isArray(studentsRes.data)
        ? studentsRes.data
        : [];
      setStudents(
        list
          .map((s) => ({
            id: s.id ?? s.student_id,
            // backend returns roll as `roll_number` and `roll` (same value), but keep robust fallback
            roll: s.roll ?? s.roll_number,
            name: s.name ?? s.student_name,
          }))
          .filter((s) => s.id != null && s.roll),
      );

    } catch (e) {
      console.error(e);
      setPopup({ type: "error", message: "Failed to load CR control data" });
    } finally {
      setLoading(false);
    }
  };

  // initial load
  useEffect(() => {
    fetchData();
  }, []);


  /* ================= ACTIONS ================= */

  const assignCR = async () => {
    if (!selectedCR || !validFrom || !validTo) {
      setPopup({
        type: "error",
        message: "CR, validity start and end dates are required",
      });
      return;
    }

    const crStudent = students.find((s) => s.roll === selectedCR);
    if (!crStudent?.id) {
      setPopup({ type: "error", message: "Selected CR is invalid" });
      return;
    }

    setLoading(true);
    try {
      await api.post("/admin/cr-assignment/current", {
        current_cr_student_id: crStudent.id,
        valid_from: validFrom,
        valid_to: validTo,
      });

      const crRes = await api.get("/admin/cr-control");
      const cr = crRes.data || {};
      setCurrentCR(cr.current || null);
      setBackupCR(cr.backup || null);

      setPopup({
        type: "success",
        message: `CR assigned to ${crStudent.name}`,
      });

      setSelectedCR("");
      setValidFrom("");
      setValidTo("");
    } catch (e) {
      console.error(e);
      setPopup({
        type: "error",
        message: "Failed to assign current CR",
      });
    } finally {
      setLoading(false);
    }
  };

  const assignBackupCR = async () => {
    if (!selectedBackup) {
      setPopup({
        type: "error",
        message: "Select a backup CR",
      });
      return;
    }

    const backup = students.find((s) => s.roll === selectedBackup);
    if (!backup?.id) {
      setPopup({ type: "error", message: "Selected backup CR is invalid" });
      return;
    }

    setLoading(true);
    try {
      await api.post("/admin/cr-assignment/backup", {
        backup_cr_student_id: backup.id,
      });

      const crRes = await api.get("/admin/cr-control");
      const cr = crRes.data || {};
      setCurrentCR(cr.current || null);
      setBackupCR(cr.backup || null);

      setPopup({
        type: "success",
        message: `Backup CR assigned to ${backup.name}`,
      });

      setSelectedBackup("");
    } catch (e) {
      console.error(e);
      setPopup({
        type: "error",
        message: "Failed to assign backup CR",
      });
    } finally {
      setLoading(false);
    }
  };

  const removeCR = async () => {
    setLoading(true);
    try {
      await api.post("/admin/cr-assignment/remove", {});

      const crRes = await api.get("/admin/cr-control");
      const cr = crRes.data || {};
      setCurrentCR(cr.current || null);
      setBackupCR(cr.backup || null);

      setPopup({
        type: "success",
        message: "CR and Backup CR removed",
      });
    } catch (e) {
      console.error(e);
      setPopup({
        type: "error",
        message: "Failed to remove CR assignment",
      });
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI ================= */

  return (
    <div className="admin-page">
      <h2>CR Assignment & Control</h2>
      <p className="muted">
        Assign, replace and manage Class Representatives
      </p>
      {adminScope && (
        <p className="muted">
          Showing students from {adminScope.department} - Year {adminScope.year} -
          Section {adminScope.section}
        </p>
      )}

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
          className="cr-select"
          value={selectedCR}
          onChange={(e) => setSelectedCR(e.target.value)}
        >
          <option value="">Select Student</option>
          {students.length === 0 && (
            <option value="" disabled>
              No students found for this section
            </option>
          )}
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

        <button className="primary-btn" onClick={assignCR} disabled={loading}>
          Assign CR
        </button>
      </div>

      {/* ================= ASSIGN BACKUP ================= */}
      <div className="admin-card">
        <h3>Assign Backup CR</h3>

        <select
          className="cr-select"
          value={selectedBackup}
          onChange={(e) => setSelectedBackup(e.target.value)}
        >
          <option value="">Select Backup CR</option>
          {students.length === 0 && (
            <option value="" disabled>
              No students found for this section
            </option>
          )}
          {students.map((s) => (
            <option key={s.roll} value={s.roll}>
              {s.roll} – {s.name}
            </option>
          ))}
        </select>

        <button className="secondary-btn" onClick={assignBackupCR} disabled={loading}>
          Assign Backup
        </button>
      </div>

      {/* ================= REMOVE ================= */}
      <div className="admin-card danger">
        <h3>Emergency Actions</h3>

        <button className="danger-btn" onClick={removeCR} disabled={loading}>
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
