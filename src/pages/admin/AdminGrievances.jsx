import { useEffect, useState } from "react";
import api from "../../api/api";
import Popup from "../../components/Popup";

function AdminGrievances() {
  const [grievances, setGrievances] = useState([]);
  const [tab, setTab] = useState("Open");
  const [selected, setSelected] = useState(null);
  const [remark, setRemark] = useState("");
  const [loading, setLoading] = useState(true);
  const [popup, setPopup] = useState({ type: "", message: "" });

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

  const fetchGrievances = async (status = tab) => {
    setLoading(true);

    try {
      const params = status ? { status } : {};
      const res = await api.get("/admin/grievances", { params });
      setGrievances(res.data.requests || []);
    } catch (error) {
      console.error("Failed to load grievances", error);
      setPopup({
        type: "error",
        message: error.response?.data?.detail || "Could not load grievances",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGrievances();
  }, [tab]);

  const handleDecision = async (decision) => {
    if (!remark.trim()) {
      setPopup({
        type: "error",
        message: "Admin remark is required",
      });
      return;
    }

    try {
      await api.post(`/admin/grievances/${selected.id}/decision`, {
        decision,
        remarks: remark,
      });

      setPopup({
        type: "success",
        message: `Grievance ${decision.toLowerCase()} successfully.`,
      });
      setSelected(null);
      setRemark("");
      fetchGrievances();
    } catch (error) {
      console.error("Failed to update grievance", error);
      setPopup({
        type: "error",
        message: error.response?.data?.detail || "Could not update grievance",
      });
    }
  };

  return (
    <div className="admin-grievance-page">
      <h2>Grievance Resolution</h2>
      <p className="muted">Review and resolve student grievances</p>

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

      {loading ? (
        <div className="muted">Loading grievances…</div>
      ) : grievances.length === 0 ? (
        <p className="muted">No grievances found</p>
      ) : (
        <div className="grievance-list">
          {grievances.map((g) => (
            <div key={g.id} className="grievance-card">
              <div>
                <strong>{g.roll_number}</strong> – {g.name}
                <p>
                  {g.grievance_type}
                  {g.slot && ` • ${g.slot}`} • {formatDate(g.request_date)}
                </p>
                <p className="muted">{g.description}</p>
                {g.proof_url && <span className="tag">Proof Attached</span>}
              </div>

              <button className="primary-btn small" onClick={() => setSelected(g)}>
                Review
              </button>
            </div>
          ))}
        </div>
      )}

      {selected && (
        <div className="full-modal">
          <div className="modal-content">
            <h3>Review Grievance</h3>

            <p>
              <strong>{selected.roll_number}</strong> – {selected.name}
            </p>

            <p>
              {selected.grievance_type}
              {selected.slot && ` (${selected.slot})`} • {formatDate(selected.request_date)}
            </p>

            <p className="muted">{selected.description}</p>

            {selected.proof_url && (
              <a
                href={selected.proof_url}
                target="_blank"
                rel="noreferrer"
                className="proof-link"
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
              <button className="secondary-btn" onClick={() => setSelected(null)}>
                Cancel
              </button>

              <button className="danger-btn" onClick={() => handleDecision("Rejected")}>Reject</button>
              <button className="primary-btn" onClick={() => handleDecision("Resolved")}>Resolve</button>
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

export default AdminGrievances;
