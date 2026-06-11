import { useEffect, useState } from "react";
import Popup from "../../components/Popup";
import api from "../../api/api";

function proofFullUrl(path) {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  const base = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");
  if (base) return `${base}${path}`;
  return path;
}

function categoryLabel(category, slots) {
  if (category === "FULL_DAY") return "Full Day";
  if (category === "SLOT")
    return slots ? `Slot-wise (${slots})` : "Slot-wise";
  return category || "—";
}

function CRAbsentApproval() {
  const [requests, setRequests] = useState([]);
  const [popup, setPopup] = useState({ type: "", message: "" });
  const [selected, setSelected] = useState(null);
  const [remarks, setRemarks] = useState("");

  const formatDate = (dateInput) => {
    if (!dateInput) return "";
    try {
      const dt = new Date(dateInput);
      if (!isNaN(dt)) {
        const day = String(dt.getDate()).padStart(2, "0");
        const month = String(dt.getMonth() + 1).padStart(2, "0");
        const year = dt.getFullYear();
        return `${day}-${month}-${year}`;
      }
    } catch (e) {}

    const raw = String(dateInput).split("T")[0];
    const parts = raw.split("-");
    if (parts.length >= 3) return `${parts[2].padStart(2, "0")}-${parts[1].padStart(2, "0")}-${parts[0]}`;
    return String(dateInput);
  };

  const fetchRequests = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await api.get("/cr/absent/pending", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRequests(res.data.requests || []);
    } catch {
      setPopup({
        type: "error",
        message: "Could not load absence requests",
      });
    }
  };

  useEffect(() => {
    fetchRequests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDecision = async (decision) => {
    try {
      const token = localStorage.getItem("token");
      const form = new FormData();
      form.append("decision", decision);
      form.append("remarks", remarks || "");

      await api.post(`/cr/absent/${selected.id}/decision`, form, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setPopup({
        type: "success",
        message: `Absence ${decision.toLowerCase()} for ${selected.roll}`,
      });
      setSelected(null);
      setRemarks("");
      await fetchRequests();
    } catch {
      setPopup({ type: "error", message: "Failed to save decision" });
    }
  };

  return (
    <div className="cr-od-page">
      <h2>Absence Requests</h2>
      <p className="muted">
        Review declare-absent requests from your section
      </p>

      <div className="od-list">
        {requests.length === 0 && (
          <p className="muted">No pending absence requests.</p>
        )}
        {requests.map((req) => (
          <div key={req.id} className="od-card">
            <div>
              <strong>{req.roll}</strong> – {req.name}
              <p>
                {categoryLabel(req.category, req.slots)} •{" "}
                {formatDate(req.date)}
              </p>
              <p className="muted">{req.reason}</p>
              {req.proof_url && (
                <span className="tag">Proof Attached</span>
              )}
            </div>
            <div>
              {req.status === "PENDING" ? (
                <button
                  type="button"
                  className="primary-btn small"
                  onClick={() => setSelected(req)}
                >
                  Review
                </button>
              ) : (
                <span
                  className={`status ${
                    req.status === "APPROVED" ? "approved" : "rejected"
                  }`}
                >
                  {req.status}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {selected && (
        <div className="full-modal">
          <div className="modal-content">
            <h3>Review Absence Request</h3>
            <p>
              <strong>{selected.roll}</strong> – {selected.name}
            </p>
            <p>
              {categoryLabel(selected.category, selected.slots)} •{" "}
              {formatDate(selected.date)}
            </p>
            <p className="muted">{selected.reason}</p>

            {selected.proof_url ? (
              <div className="od-proof">
                <label>Attached Proof</label>
                {(selected.proof_type || "").startsWith("image/") ? (
                  <img
                    src={proofFullUrl(selected.proof_url)}
                    alt="Absence proof"
                    className="od-proof-image"
                    onClick={() =>
                      window.open(proofFullUrl(selected.proof_url), "_blank")
                    }
                  />
                ) : (
                  <a
                    href={proofFullUrl(selected.proof_url)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="od-proof-link"
                  >
                    View attached document
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
                type="button"
                className="secondary-btn"
                onClick={() => setSelected(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="danger-btn"
                onClick={() => handleDecision("REJECTED")}
              >
                Reject
              </button>
              <button
                type="button"
                className="primary-btn"
                onClick={() => handleDecision("APPROVED")}
              >
                Approve
              </button>
            </div>
          </div>
        </div>
      )}

      <Popup
        type={popup.type}
        message={popup.message}
        actionText="OK"
        onAction={() => setPopup({ type: "", message: "" })}
      />
    </div>
  );
}

export default CRAbsentApproval;
