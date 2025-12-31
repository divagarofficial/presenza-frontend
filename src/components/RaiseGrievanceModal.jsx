import { useState } from "react";
import Popup from "./Popup";

function RaiseGrievanceModal({ onClose }) {
  const [type, setType] = useState("");
  const [date, setDate] = useState("");
  const [slot, setSlot] = useState("");
  const [desc, setDesc] = useState("");
  const [file, setFile] = useState(null);

  const [popup, setPopup] = useState({ type: "", message: "" });

  const handleSubmit = () => {
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

    console.log({ type, date, slot, desc, file });

    setPopup({
      type: "success",
      message: "Grievance submitted successfully",
    });
  };

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
          onChange={(e) => setFile(e.target.files[0])}
        />

        <div className="modal-actions">
          <button className="secondary-btn" onClick={onClose}>
            Cancel
          </button>
          <button className="primary-btn" onClick={handleSubmit}>
            Submit
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
