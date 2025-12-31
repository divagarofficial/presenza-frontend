import { useState } from "react";
import Popup from "../../components/Popup";

function CRODApproval() {
  /* ===== MOCK OD REQUESTS ===== */
  const [requests, setRequests] = useState([
  {
    id: 1,
    roll: "21AD001",
    name: "Arjun",
    type: "Full Day",
    date: "2025-12-12",
    reason: "Inter-college event",
    proof_url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    proof_type: "pdf",
    status: "Pending",
  },
  {
    id: 2,
    roll: "21AD014",
    name: "Meena",
    type: "Slot-wise",
    slot: "Slot 3",
    date: "2025-12-14",
    reason: "Medical appointment",
    proof_url: "https://via.placeholder.com/600x400",
    proof_type: "image",
    status: "Pending",
  },
]);

  const [popup, setPopup] = useState({ type: "", message: "" });
  const [selected, setSelected] = useState(null);
  const [remarks, setRemarks] = useState("");

  const formatDate = (d) => {
    const [y, m, day] = d.split("-");
    return `${day}-${m}-${y}`;
  };

  const handleDecision = (decision) => {
    setRequests((prev) =>
      prev.map((r) =>
        r.id === selected.id
          ? { ...r, status: decision }
          : r
      )
    );

    setPopup({
      type: "success",
      message: `OD ${decision} for ${selected.roll}`,
    });

    setSelected(null);
    setRemarks("");
  };

  return (
    <div className="cr-od-page">
      <h2>OD Approval</h2>
      <p className="muted">
        Review and approve OD requests from your section
      </p>

      {/* REQUEST LIST */}
      <div className="od-list">
        {requests.map((req) => (
          <div key={req.id} className="od-card">
            <div>
              <strong>{req.roll}</strong> – {req.name}
              <p>
                {req.type}
                {req.slot && ` • ${req.slot}`} •{" "}
                {formatDate(req.date)}
              </p>
              <p className="muted">{req.reason}</p>

              {req.proof_url && (
                <span className="tag">Proof Attached</span>
              )}
            </div>

            <div>
              {req.status === "Pending" ? (
                <button
                  className="primary-btn small"
                  onClick={() => setSelected(req)}
                >
                  Review
                </button>
              ) : (
                <span
                  className={`status ${
                    req.status === "Approved"
                      ? "approved"
                      : "rejected"
                  }`}
                >
                  {req.status}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* REVIEW MODAL */}
      {selected && (
        <div className="full-modal">
          <div className="modal-content">
            <h3>Review OD Request</h3>

            <p>
              <strong>{selected.roll}</strong> – {selected.name}
            </p>

            <p>
              {selected.type}
              {selected.slot && ` (${selected.slot})`} •{" "}
              {formatDate(selected.date)}
            </p>

            <p className="muted">{selected.reason}</p>

            {/* ===== PROOF VIEW ===== */}
            {selected.proof_url ? (
              <div className="od-proof">
                <label>Attached Proof</label>

                {selected.proof_type === "image" ? (
                  <img
                    src={selected.proof_url}
                    alt="OD Proof"
                    className="od-proof-image"
                    onClick={() =>
                      window.open(selected.proof_url, "_blank")
                    }
                  />
                ) : (
                  <a
                    href={selected.proof_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="od-proof-link"
                  >
                    📄 View Attached Document
                  </a>
                )}
              </div>
            ) : (
              <p className="muted">No proof attached</p>
            )}

            <textarea
              placeholder="CR remarks (optional)"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
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
                onClick={() => handleDecision("Approved")}
              >
                Approve
              </button>
            </div>
          </div>
        </div>
      )}

      {/* POPUP */}
      <Popup
        type={popup.type}
        message={popup.message}
        actionText="OK"
        onAction={() => setPopup({ type: "", message: "" })}
      />
    </div>
  );
}

export default CRODApproval;
