import { useState } from "react";
import { FaPlusCircle } from "react-icons/fa";
import RaiseGrievanceModal from "../../components/RaiseGrievanceModal";

function Grievance() {
  const [openModal, setOpenModal] = useState(false);

  const grievances = [
    { date: "12-12-2025", type: "Slot Attendance", status: "Under Review" },
    { date: "08-12-2025", type: "OD Not Reflected", status: "Resolved" },
    { date: "02-12-2025", type: "Daily Attendance", status: "Rejected" },
  ];

  const getStatusColor = (status) => {
    if (status === "Resolved") return "#22c55e";
    if (status === "Rejected") return "#ef4444";
    return "#f59e0b";
  };

  return (
    <div className="grievance-page">
      {/* ACTION */}
      <button
        className="primary-btn"
        style={{ marginBottom: "16px" }}
        onClick={() => setOpenModal(true)}
      >
        <FaPlusCircle /> Raise Grievance
      </button>

      {/* TITLE */}
      <h2 style={{ marginBottom: "12px" }}>Grievances</h2>

      {/* HISTORY */}
      <div className="grievance-history">
        {grievances.map((g, i) => (
          <div key={i} className="grievance-card">
            <div>
              <strong>{g.type}</strong>
              <p>{g.date}</p>
            </div>

            <span
              className="status-pill"
              style={{ color: getStatusColor(g.status) }}
            >
              {g.status}
            </span>
          </div>
        ))}
      </div>

      {/* MODAL */}
      {openModal && (
        <RaiseGrievanceModal onClose={() => setOpenModal(false)} />
      )}
    </div>
  );
}

export default Grievance;
