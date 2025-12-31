import { useState } from "react";
import Popup from "../../components/Popup";
import api from "../../api/api";

function SemesterManagement() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);

  const [popup, setPopup] = useState({
    type: "",
    message: "",
    action: null,
  });

  // ==============================
  // SAVE SEMESTER
  // ==============================
  const handleSave = async () => {
    if (!startDate || !endDate) {
      setPopup({
        type: "error",
        message: "Please select both start and end dates",
      });
      return;
    }

    if (new Date(startDate) >= new Date(endDate)) {
      setPopup({
        type: "error",
        message: "End date must be after start date",
      });
      return;
    }

    try {
      setLoading(true);

      await api.post("/admin/semester", {
        start_date: startDate,
        end_date: endDate,
      });

      setPopup({
        type: "success",
        message: "Semester dates saved successfully",
      });
    } catch (err) {
      setPopup({
        type: "error",
        message:
          err.response?.data?.detail ||
          "Failed to save semester dates",
      });
    } finally {
      setLoading(false);
    }
  };

  // ==============================
  // RESET SEMESTER
  // ==============================
  const handleReset = () => {
    setPopup({
      type: "error",
      message:
        "Are you sure? This will reset ALL semester data. This action cannot be undone.",
      action: "confirm-reset",
    });
  };

  const confirmReset = async () => {
    try {
      setLoading(true);

      await api.post("/admin/semester/reset");

      setPopup({
        type: "success",
        message: "Semester reset completed successfully",
      });
    } catch (err) {
      setPopup({
        type: "error",
        message:
          err.response?.data?.detail ||
          "Failed to reset semester",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-page">
      <h2>Semester Management</h2>
      <p className="muted">
        Define academic duration and manage semester lifecycle
      </p>

      {/* ===== SET SEMESTER ===== */}
      <div className="admin-card">
        <h3>Set Semester Duration</h3>

        <div className="form-grid">
          <div className="form-group">
            <label>Semester Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label>Semester End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              disabled={loading}
            />
          </div>
        </div>

        <button
          className="primary-btn"
          onClick={handleSave}
          disabled={loading}
        >
          {loading ? "Saving..." : "Save Semester"}
        </button>
      </div>

      {/* ===== RESET SEMESTER ===== */}
      <div className="admin-card danger">
        <h3>Reset Semester</h3>
        <p className="muted">
          This will permanently delete attendance, QR, timetable
          and subject data. Student accounts will remain.
        </p>

        <button
          className="danger-btn"
          onClick={handleReset}
          disabled={loading}
        >
          Reset Semester
        </button>
      </div>

      {/* ===== POPUP ===== */}
      <Popup
        type={popup.type}
        message={popup.message}
        actionText={
          popup.action === "confirm-reset"
            ? "Confirm Reset"
            : "OK"
        }
        onAction={() => {
          if (popup.action === "confirm-reset") {
            confirmReset();
          } else {
            setPopup({ type: "", message: "", action: null });
          }
        }}
      />
    </div>
  );
}

export default SemesterManagement;
