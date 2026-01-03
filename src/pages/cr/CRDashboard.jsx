import {
  FaUsers,
  FaClipboardCheck,
  FaExclamationTriangle,
  FaClock,
  FaShieldAlt,
  FaEdit, // ✅ NEW ICON
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../api/api";

function CRDashboard() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    section: "",
    total_students: 0,
    marked: 0,
    pending_od: 0,
    open_grievances: 0,
    last_scan: "—",
  });

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get("/cr/dashboard/summary");
        setData(res.data);
      } catch (err) {
        console.error("CR dashboard fetch failed", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return <div className="muted">Loading dashboard…</div>;
  }

  return (
    <div className="cr-dashboard">
      {/* HEADER */}
      <div className="cr-hero">
        <FaShieldAlt className="cr-badge" />
        <h2>Class Representative</h2>
        <p>{data.section}</p>
      </div>

      {/* STATS */}
      <div className="cr-stats">
        <div className="cr-stat">
          <span>
            {data.marked}/{data.total_students}
          </span>
          <p>Attendance Marked</p>
        </div>

        <div className="cr-stat warning">
          <span>{data.pending_od}</span>
          <p>OD Requests</p>
        </div>

        <div className="cr-stat danger">
          <span>{data.open_grievances}</span>
          <p>Open Grievances</p>
        </div>
      </div>

      {/* ACTION CARDS */}
      <div className="cr-actions">
        {/* Scan Attendance */}
        <div
          className="cr-action-card"
          onClick={() => navigate("/student/cr/scan-attendance")}
        >
          <FaUsers />
          <span>Scan Attendance</span>
        </div>

        {/* ✅ Manual Attendance */}
        <div
          className="cr-action-card"
          onClick={() => navigate("/student/cr/manual-attendance")}
        >
          <FaEdit />
          <span>Manual Attendance</span>
        </div>

        {/* Approve OD */}
        <div
          className="cr-action-card"
          onClick={() => navigate("/student/cr/od")}
        >
          <FaClipboardCheck />
          <span>Approve OD</span>
        </div>

        {/* View Grievances */}
        <div
          className="cr-action-card"
          onClick={() => navigate("/student/cr/grievances")}
        >
          <FaExclamationTriangle />
          <span>View Grievances</span>
        </div>

        {/* Last Scan */}
        <div className="cr-action-card muted">
          <FaClock />
          <span>Last Scan: {data.last_scan}</span>
        </div>
      </div>
    </div>
  );
}

export default CRDashboard;
