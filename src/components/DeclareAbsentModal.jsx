import { useState } from "react";
import Popup from "./Popup";

function DeclareAbsentModal({ slots, onClose, onSubmit }) {
  const [category, setCategory] = useState("");
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [reason, setReason] = useState("");
  const [proof, setProof] = useState(null);

  const [popup, setPopup] = useState({ type: "", message: "" });

  const toggleSlot = (slot) => {
    setSelectedSlots((prev) =>
      prev.includes(slot)
        ? prev.filter((s) => s !== slot)
        : [...prev, slot]
    );
  };

  const handleSubmit = async () => {
    if (!category) {
      return setPopup({
        type: "error",
        message: "Please choose absence category",
      });
    }

    if (category === "slot" && selectedSlots.length === 0) {
      return setPopup({
        type: "error",
        message: "Please select at least one slot",
      });
    }

    if (!reason.trim()) {
      return setPopup({
        type: "error",
        message: "Reason is required",
      });
    }

    try {
      await onSubmit({
        category,
        slots: category === "slot" ? selectedSlots : "FULL_DAY",
        reason,
        proof,
      });
      setPopup({
        type: "success",
        message: "Absence request submitted. Awaiting CR approval.",
      });
    } catch (e) {
      const status = e?.response?.status;
      const d = e?.response?.data?.detail;
      let message =
        typeof d === "string"
          ? d
          : Array.isArray(d)
            ? d.map((x) => x.msg || String(x)).join(", ")
            : "Failed to submit absence request";
      if (status === 404 && (!d || d === "Not Found")) {
        message =
          "Server returned 404. Check that the API is running and VITE_API_URL / dev proxy is configured.";
      }
      setPopup({ type: "error", message });
    }
  };

  return (
    <div className="modal-fullscreen">
      <div className="modal-header">
        <h2>Declare Absence</h2>
        <button type="button" className="close-btn" onClick={onClose}>
          ✕
        </button>
      </div>

      <div className="modal-body">
        <div className="form-group">
          <label>Absence Category *</label>
          <div className="radio-group">
            <label>
              <input
                type="radio"
                name="category"
                value="full"
                checked={category === "full"}
                onChange={() => setCategory("full")}
              />
              Full Day
            </label>

            <label>
              <input
                type="radio"
                name="category"
                value="slot"
                checked={category === "slot"}
                onChange={() => setCategory("slot")}
              />
              Slot-wise
            </label>
          </div>
        </div>

        {category === "slot" && (
          <div className="form-group">
            <label>Select Slots *</label>
            <div className="slot-checkboxes">
              {slots.length === 0 ? (
                <p className="muted">
                  No timetable slots loaded. Open this page when slots are
                  available, or choose Full Day.
                </p>
              ) : (
                slots.map((s, i) => (
                  <label key={`${s.slot}-${i}`}>
                    <input
                      type="checkbox"
                      checked={selectedSlots.includes(s.slot)}
                      onChange={() => toggleSlot(s.slot)}
                    />
                    {s.slot} – {s.subject}
                  </label>
                ))
              )}
            </div>
          </div>
        )}

        <div className="form-group">
          <label>Reason *</label>
          <textarea
            placeholder="Explain your reason clearly..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Attach Proof (Optional)</label>
          <input
            type="file"
            accept=".pdf,image/*"
            onChange={(e) => setProof(e.target.files?.[0] || null)}
          />
          {proof && <small>Selected: {proof.name}</small>}
        </div>
      </div>

      <div className="modal-footer">
        <button type="button" className="secondary-btn" onClick={onClose}>
          Cancel
        </button>
        <button type="button" className="primary-btn" onClick={handleSubmit}>
          Submit
        </button>
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

export default DeclareAbsentModal;
