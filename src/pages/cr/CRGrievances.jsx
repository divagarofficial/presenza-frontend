import { useState } from "react";

function CRGrievances() {
  /* ===== MOCK DATA (BACKEND LATER) ===== */
  const grievances = [
    {
      id: 1,
      roll: "21AD001",
      name: "Arjun",
      type: "Slot",
      date: "2025-12-12",
      slot: "Slot 3",
      reason: "Attendance not marked",
      description:
        "I was present but my attendance was not marked due to QR issue.",
      attachment:
        "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
      status: "Open",
    },
    {
      id: 2,
      roll: "21AD014",
      name: "Meena",
      type: "Daily",
      date: "2025-12-10",
      reason: "OD not reflected",
      description:
        "My OD was approved but attendance still shows absent.",
      attachment:
        "https://via.placeholder.com/600x400",
      status: "Under Review",
    },
  ];

  const [selected, setSelected] = useState(null);

  const formatDate = (d) => {
    const [y, m, day] = d.split("-");
    return `${day}-${m}-${y}`;
  };

  return (
    <div className="cr-grievance-page">
      <h2>Class Grievances</h2>
      <p className="muted">
        View grievances raised by students in your class
      </p>

      {/* LIST */}
      <div className="grievance-list">
        {grievances.map((g) => (
          <div key={g.id} className="grievance-card">
            <div>
              <strong>
                {g.roll} – {g.name}
              </strong>
              <p className="muted">
                {g.type}
                {g.slot && ` • ${g.slot}`} •{" "}
                {formatDate(g.date)}
              </p>
              <p>{g.reason}</p>
            </div>

            <div className="grievance-right">
              <span className={`status ${g.status.toLowerCase()}`}>
                {g.status}
              </span>
              <button
                className="secondary-btn small"
                onClick={() => setSelected(g)}
              >
                View
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* DETAILS MODAL */}
      {selected && (
        <div className="full-modal">
          <div className="modal-content">
            <h3>Grievance Details</h3>

            <p>
              <strong>{selected.roll}</strong> –{" "}
              {selected.name}
            </p>

            <p>
              {selected.type}
              {selected.slot && ` (${selected.slot})`} •{" "}
              {formatDate(selected.date)}
            </p>

            <p className="muted">{selected.description}</p>

            {/* ATTACHMENT */}
            <div className="grievance-proof">
              <label>Attachment</label>
              {selected.attachment.endsWith(".pdf") ? (
                <a
                  href={selected.attachment}
                  target="_blank"
                  rel="noreferrer"
                  className="proof-link"
                >
                  📄 View Document
                </a>
              ) : (
                <img
                  src={selected.attachment}
                  alt="Proof"
                  className="proof-image"
                  onClick={() =>
                    window.open(selected.attachment, "_blank")
                  }
                />
              )}
            </div>

            <div className="modal-actions">
              <button
                className="primary-btn"
                onClick={() => setSelected(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CRGrievances;
