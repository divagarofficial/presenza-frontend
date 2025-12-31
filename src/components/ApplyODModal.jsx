import { useState } from "react";
import Popup from "./Popup";

function ApplyODModal({ onClose, onSubmit }) {
  const [category, setCategory] = useState("");
  const [slots, setSlots] = useState([]);
  const [reason, setReason] = useState("");
  const [proof, setProof] = useState(null);

  const [popup, setPopup] = useState({ type: "", message: "" });

  const slotList = ["Slot 1", "Slot 2", "Slot 3", "Slot 4"];

  const toggleSlot = (slot) => {
    setSlots((prev) =>
      prev.includes(slot)
        ? prev.filter((s) => s !== slot)
        : [...prev, slot]
    );
  };

  const handleSubmit = () => {
    if (!category) {
      return setPopup({
        type: "error",
        message: "Please choose OD category",
      });
    }

    if (category === "slot" && slots.length === 0) {
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

    if (!proof) {
      return setPopup({
        type: "error",
        message: "Proof attachment is mandatory",
      });
    }

    onSubmit({
      category,
      slots: category === "slot" ? slots : "FULL_DAY",
      reason,
      proof,
    });

    setPopup({
      type: "success",
      message: "OD applied successfully",
    });
  };

  return (
    <div className="fullpage-modal">
      {/* HEADER */}
      <div className="modal-header">
        <h2>Apply OD</h2>
        <p>Official Duty Request</p>
      </div>

      {/* CONTENT */}
      <div className="modal-body">
        {/* CATEGORY */}
        <div className="form-group">
          <label>Choose OD Category</label>

          <div className="radio-group">
            <label>
              <input
                type="radio"
                checked={category === "full"}
                onChange={() => setCategory("full")}
              />
              Full Day
            </label>

            <label>
              <input
                type="radio"
                checked={category === "slot"}
                onChange={() => setCategory("slot")}
              />
              Slot-wise
            </label>
          </div>
        </div>

        {/* SLOT SELECTION */}
        {category === "slot" && (
          <div className="form-group">
            <label>Select Slots</label>

            <div className="checkbox-group">
              {slotList.map((slot) => (
                <label key={slot}>
                  <input
                    type="checkbox"
                    checked={slots.includes(slot)}
                    onChange={() => toggleSlot(slot)}
                  />
                  {slot}
                </label>
              ))}
            </div>
          </div>
        )}

        {/* REASON */}
        <div className="form-group">
          <label>Reason for OD</label>
          <textarea
            placeholder="Explain your reason clearly"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
        </div>

        {/* PROOF */}
        <div className="form-group">
          <label>Attach Proof (Required)</label>
          <input
            type="file"
            accept=".pdf,image/*"
            onChange={(e) => setProof(e.target.files[0])}
          />
          {proof && (
            <p className="file-name">{proof.name}</p>
          )}
        </div>
      </div>

      {/* FOOTER */}
      <div className="modal-footer">
        <button className="secondary-btn" onClick={onClose}>
          Cancel
        </button>

        <button className="primary-btn" onClick={handleSubmit}>
          Submit OD
        </button>
      </div>

      {/* POPUP */}
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

export default ApplyODModal;
