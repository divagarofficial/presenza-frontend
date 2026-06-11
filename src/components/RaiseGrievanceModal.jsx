import { useState, useEffect } from "react";
import api from "../api/api";
import Popup from "./Popup";

function RaiseGrievanceModal({ onClose, onSubmitSuccess, onError }) {
  const [type, setType] = useState("");
  const [date, setDate] = useState("");
  const [slot, setSlot] = useState("");
  const [desc, setDesc] = useState("");
  const [file, setFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [popup, setPopup] = useState({ type: "", message: "" });
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleSubmit = async () => {
    if (!type || !date || !desc || !file) {
      setPopup({
        type: "error",
        message: "All fields and attachment are mandatory",
      });
      return;
    }

    if (type === "Slot" && !slot) {
      setPopup({
        type: "error",
        message: "Slot selection is required",
      });
      return;
    }

    const formData = new FormData();
    formData.append("grievance_type", type);
    formData.append("request_date", date);
    if (slot) {
      formData.append("slot", slot);
    }
    formData.append("description", desc);
    formData.append("proof", file);

    setSubmitting(true);

    try {
      await api.post("/students/grievances", formData, {
        headers: { "Content-Type": undefined },
      });

      setPopup({
        type: "success",
        message: "Grievance submitted successfully",
      });
      onSubmitSuccess?.();
    } catch (error) {
      console.error("Grievance submission failed", error);
      const message = error.response?.data?.detail || "Failed to submit grievance";
      setPopup({ type: "error", message });
      onError?.(message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleFileChange = (f) => {
    if (!f) {
      setFile(null);
      setPreviewUrl(null);
      return;
    }

    const maxSize = 6 * 1024 * 1024; // 6MB
    if (f.size > maxSize) {
      setPopup({ type: "error", message: "File is too large (max 6MB)" });
      setFile(null);
      setPreviewUrl(null);
      return;
    }

    setFile(f);

    if (f.type && f.type.startsWith("image/")) {
      const url = URL.createObjectURL(f);
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }
  };

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  return (
    <div className="full-modal">
      <div className="full-modal-content">
        <h2>Raise Grievance</h2>

        <label>Type</label>
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="">Select</option>
          <option value="Daily">Incorrect Daily Attendance</option>
          <option value="Slot">Missing Slot Attendance</option>
          <option value="OD">OD Not Reflected</option>
          <option value="Other">Other</option>
        </select>

        <label>Date</label>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />

        {type === "Slot" && (
          <>
            <label>Slot</label>
            <select value={slot} onChange={(e) => setSlot(e.target.value)}>
              <option value="">Select Slot</option>
              <option>Slot 1</option>
              <option>Slot 2</option>
              <option>Slot 3</option>
              <option>Slot 4</option>
            </select>
          </>
        )}

        <label>Description</label>
        <textarea
          placeholder="Explain the issue clearly"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
        />

        <label>Attach Proof (Mandatory)</label>
        <input
          type="file"
          accept="image/*,.pdf"
          onChange={(e) => handleFileChange(e.target.files[0])}
        />

        {previewUrl && (
          <div className="proof-preview">
            <label>Preview</label>
            <img src={previewUrl} alt="proof preview" />
          </div>
        )}

        <div className="modal-actions">
          <button className="secondary-btn" onClick={onClose} disabled={submitting}>
            Cancel
          </button>
          <button className="primary-btn" onClick={handleSubmit} disabled={submitting}>
            {submitting ? "Submitting…" : "Submit"}
          </button>
        </div>
      </div>

      <Popup
        type={popup.type}
        message={popup.message}
        actionText={popup.type === "success" ? "OK" : "Retry"}
        onAction={() => {
          if (popup.type === "success") {
            onClose();
          } else {
            setPopup({ type: "", message: "" });
          }
        }}
      />
    </div>
  );
}

export default RaiseGrievanceModal;
