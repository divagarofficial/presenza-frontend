import { useEffect, useState } from "react";
import { FaPlusCircle } from "react-icons/fa";
import api from "../../api/api";
import Popup from "../../components/Popup";
import RaiseGrievanceModal from "../../components/RaiseGrievanceModal";

function Grievance() {
  const [openModal, setOpenModal] = useState(false);
  const [grievances, setGrievances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [popup, setPopup] = useState({ type: "", message: "" });
  const [selected, setSelected] = useState(null);

  const fetchGrievances = async () => {
    setLoading(true);
    try {
      const res = await api.get("/students/grievances");
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
  }, []);

  const formatDate = (dateInput) => {
    if (!dateInput) return "";
    try {
      const d = new Date(dateInput);
      if (!isNaN(d)) {
        const day = String(d.getDate()).padStart(2, "0");
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const year = d.getFullYear();
        return `${day}-${month}-${year}`;
      }
    } catch (e) {}

    const raw = String(dateInput).split("T")[0];
    const parts = raw.split("-");
    if (parts.length >= 3) return `${parts[2].padStart(2, "0")}-${parts[1].padStart(2, "0")}-${parts[0]}`;
    return String(dateInput);
  };

  const getStatusColor = (status) => {
    if (status === "Resolved") return "#22c55e";
    if (status === "Rejected") return "#ef4444";
    if (status === "Under Review") return "#f59e0b";
    return "#0b70d2";
  };

  return (
    <div className="grievance-page">
      <button
        className="primary-btn"
        style={{ marginBottom: "16px" }}
        onClick={() => setOpenModal(true)}
      >
        <FaPlusCircle /> Raise Grievance
      </button>

      <h2 style={{ marginBottom: "12px" }}>Grievances</h2>

      {loading ? (
        <div className="muted">Loading grievances…</div>
      ) : grievances.length === 0 ? (
        <p className="muted">No grievances found. Raise one to get support.</p>
      ) : (
        <div className="grievance-history">
          {grievances.map((g) => (
            <div key={g.id} className="grievance-card">
              <div className="grievance-left">
                <strong>{g.grievance_type}</strong>
                <p className="muted small-date">{formatDate(g.request_date)}</p>
                <p className="muted desc">{g.description}</p>
                {g.review_remarks && (
                  <p className="muted">Admin: {g.review_remarks}</p>
                )}
              </div>

              <div className="grievance-right">
                <button className="secondary-btn small" onClick={() => setSelected(g)}>View</button>
                <span className={`status-pill ${g.status.toLowerCase().replace(/ /g, "-")}`}>
                  {g.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {openModal && (
        <RaiseGrievanceModal
          onClose={() => setOpenModal(false)}
          onSubmitSuccess={() => {
            setOpenModal(false);
            fetchGrievances();
            setPopup({
              type: "success",
              message: "Grievance submitted successfully.",
            });
          }}
          onError={(message) =>
            setPopup({ type: "error", message: message || "Submission failed" })
          }
        />
      )}

      {selected && (
        <div className="full-modal">
          <div className="modal-content">
            <h3>Grievance Details</h3>

            <p>
              <strong>{selected.grievance_type}</strong> • {formatDate(selected.request_date)}
            </p>

            <p className="muted">{selected.description}</p>

            {selected.proof_url && (
              <div className="grievance-proof">
                <label>Attachment</label>
                <a href={selected.proof_url} target="_blank" rel="noreferrer" className="proof-link">
                  View uploaded proof
                </a>
              </div>
            )}

            {selected.review_remarks && (
              <p style={{ marginTop: 10 }}><strong>Admin remark:</strong> {selected.review_remarks}</p>
            )}

            <div className="modal-actions">
              <button className="secondary-btn" onClick={() => setSelected(null)}>Close</button>
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

export default Grievance;
