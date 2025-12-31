import { useState } from "react";
import Popup from "../../components/Popup";

function AdminGrievances() {
  /* ===== MOCK DATA (BACKEND LATER) ===== */
  const [grievances, setGrievances] = useState([
    {
      id: 1,
      roll: "21AD001",
      name: "Arjun",
      type: "Slot",
      date: "2025-12-10",
      slot: "Slot 2",
      description: "Attendance marked absent though I was present",
      attachment: true,
      status: "Open",
    },
    {
      id: 2,
      roll: "21AD014",
      name: "Meena",
      type: "Daily",
      date: "2025-12-05",
      description: "OD not reflected in attendance",
      attachment: true,
      status: "Under Review",
    },
  ]);

  const [tab, setTab] = useState("Open");
  const [selected, setSelected] = useState(null);
  const [remark, setRemark] = useState("");
  const [popup, setPopup] = useState({ type: "", message: "" });

  const formatDate = (d) => {
    const [y, m, day] = d.split("-");
    return `${day}-${m}-${y}`;
  };

  const filtered = grievances.filter((g) => g.status === tab);

  const handleDecision = (decision) => {
    if (!remark.trim()) {
      setPopup({
        type: "error",
        message: "Admin remark is required",
      });
      return;
    }

    setGrievances((prev) =>
      prev.map((g) =>
        g.id === selected.id
          ? { ...g, status: decision }
          : g
      )
    );

    setPopup({
      type: "success",
      message: `Grievance ${decision}`,
    });

    setSelected(null);
    setRemark("");
  };

  return (
    <div className="admin-grievance-page">
      <h2>Grievance Resolution</h2>
      <p className="muted">Review and resolve student grievances</p>

      {/* ===== STATUS TABS ===== */}
      <div className="grievance-tabs">
        {["Open", "Under Review", "Resolved", "Rejected"].map((s) => (
          <button
            key={s}
            className={tab === s ? "active" : ""}
            onClick={() => setTab(s)}
          >
            {s}
          </button>
        ))}
      </div>

      {/* ===== LIST ===== */}
      <div className="grievance-list">
        {filtered.length === 0 && (
          <p className="muted">No grievances found</p>
        )}

        {filtered.map((g) => (
          <div key={g.id} className="grievance-card">
            <div>
              <strong>{g.roll}</strong> – {g.name}
              <p>
                {g.type}
                {g.slot && ` • ${g.slot}`} • {formatDate(g.date)}
              </p>
              <p className="muted">{g.description}</p>

              {g.attachment && (
                <span className="tag">Proof Attached</span>
              )}
            </div>

            <button
              className="primary-btn small"
              onClick={() => setSelected(g)}
            >
              Review
            </button>
          </div>
        ))}
      </div>

      {/* ===== REVIEW MODAL ===== */}
      {selected && (
        <div className="full-modal">
          <div className="modal-content">
            <h3>Review Grievance</h3>

            <p>
              <strong>{selected.roll}</strong> – {selected.name}
            </p>

            <p>
              {selected.type}
              {selected.slot && ` (${selected.slot})`} •{" "}
              {formatDate(selected.date)}
            </p>

            <p className="muted">{selected.description}</p>

            {/* ATTACHMENT */}
            {selected.attachment && (
              <a
                href="#"
                className="proof-link"
                onClick={(e) => e.preventDefault()}
              >
                View / Download Proof
              </a>
            )}

            <textarea
              placeholder="Admin resolution remark (required)"
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
            />

            <div className="modal-actions">
              <button
                className="secondary-btn"
                onClick={() => setSelected(null)}
              >
                Cancel
              </button>

              <button
                className="danger-btn"
                onClick={() => handleDecision("Rejected")}
              >
                Reject
              </button>

              <button
                className="primary-btn"
                onClick={() => handleDecision("Resolved")}
              >
                Resolve
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== POPUP ===== */}
      <Popup
        type={popup.type}
        message={popup.message}
        actionText="OK"
        onAction={() => setPopup({ type: "", message: "" })}
      />
    </div>
  );
}

export default AdminGrievances;
