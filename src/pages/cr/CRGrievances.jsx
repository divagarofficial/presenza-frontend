import { useEffect, useState } from "react";
import api from "../../api/api";
import Popup from "../../components/Popup";

function CRGrievances() {
  const [grievances, setGrievances] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [popup, setPopup] = useState({ type: "", message: "" });

  const fetchGrievances = async () => {
    setLoading(true);
    try {
      const res = await api.get("/cr/grievances");
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


  return (
    <div className="cr-grievance-page">
      <h2>Class Grievances</h2>
      <p className="muted">View grievances raised by students in your class</p>

      {loading ? (
        <div className="muted">Loading grievances…</div>
      ) : grievances.length === 0 ? (
        <p className="muted">No grievances have been submitted yet.</p>
      ) : (
        <div className="grievance-list">
          {grievances.map((g) => (
            <div key={g.id} className="grievance-card">
              <div>
                <strong>
                  {g.roll_number} – {g.name}
                </strong>
                <p className="muted">
                  {g.grievance_type}
                  {g.slot && ` • ${g.slot}`} • {formatDate(g.request_date)}
                </p>
                <p>{g.description}</p>
              </div>

              <div className="grievance-right">
                <span className={`status ${g.status.toLowerCase().replace(/ /g, "-")}`}>
                  {g.status}
                </span>
                <button className="secondary-btn small" onClick={() => setSelected(g)}>
                  View
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {selected && (
        <div className="full-modal">
          <div className="modal-content">
            <h3>Grievance Details</h3>

            <p>
              <strong>{selected.roll_number}</strong> – {selected.name}
            </p>

            <p>
              {selected.grievance_type}
              {selected.slot && ` (${selected.slot})`} • {formatDate(selected.request_date)}
            </p>

            <p className="muted">{selected.description}</p>

            {selected.proof_url && (
              <div className="grievance-proof">
                <label>Attachment</label>
                <a
                  href={selected.proof_url}
                  target="_blank"
                  rel="noreferrer"
                  className="proof-link"
                >
                  View uploaded proof
                </a>
              </div>
            )}

            {selected.review_remarks && (
              <p className="muted" style={{ marginTop: 10 }}>
                <strong>Admin remarks:</strong> {selected.review_remarks}
              </p>
            )}

            <p className="muted" style={{ marginTop: 12 }}>
              Only the class admin can update grievance status.
            </p>

            <div className="modal-actions">
              <button className="secondary-btn" onClick={() => setSelected(null)}>
                Close
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

export default CRGrievances;
