import {
  FaUsers,
  FaLayerGroup,
  FaCalendarCheck,
  FaClipboardList,
  FaUserPlus,
  FaQrcode,
  FaTable,
  FaUserShield,
  FaCog,
  FaClock,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../api/api";

function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const res = await api.get("/admin/dashboard/stats");
      setStats(res.data);
    } catch (err) {
      console.error("Dashboard load failed", err);
    }
  };

  if (!stats) {
    return <div className="admin-dashboard">Loading dashboard...</div>;
  }

  return (
    <div className="admin-dashboard">
      {/* ===== HEADER ===== */}
      <div className="admin-header">
        <div>
          <h2>Admin Control Center</h2>

          <div className="date-highlight">
            <FaClock />
            <span>{new Date().toDateString()}</span>
            <span className="dot">•</span>
            <span className={stats.semester_active ? "status" : "status danger"}>
              {stats.semester_active ? "Semester Active" : "Semester Inactive"}
            </span>
          </div>
        </div>
      </div>

      {/* ===== KPI STATS ===== */}
      <div className="admin-stats">
        <div className="stat-card">
          <FaUsers />
          <div>
            <strong>{stats.students}</strong>
            <span>Total Students</span>
          </div>
        </div>

        <div className="stat-card">
          <FaLayerGroup />
          <div>
            <strong>{stats.sections}</strong>
            <span>Sections</span>
          </div>
        </div>

        <div className="stat-card success">
          <FaCalendarCheck />
          <div>
            <strong>{stats.present_percent}%</strong>
            <span>Today Present</span>
          </div>
        </div>

        <div className="stat-card warning">
          <FaClipboardList />
          <div>
            <strong>{stats.pending_od}</strong>
            <span>Pending OD</span>
          </div>
        </div>
      </div>

      {/* ===== QUICK ACTIONS ===== */}
      <h3 className="section-title">Quick Actions</h3>

      <div className="admin-actions">
        <div className="action-card" onClick={() => navigate("/admin/students")}>
          <FaUserPlus />
          <span>Register Students</span>
        </div>

        <div className="action-card" onClick={() => navigate("/admin/timetable")}>
          <FaTable />
          <span>Timetable Management</span>
        </div>

        <div className="action-card" onClick={() => navigate("/admin/admin-qr")}>
          <FaQrcode />
          <span>Generate QR</span>
        </div>

        <div className="action-card" onClick={() => navigate("/admin/cr-control")}>
          <FaUserShield />
          <span>CR Assignment</span>
        </div>

        <div
          className="action-card"
          onClick={() => navigate("/admin/attendance-monitoring")}
        >
          <FaCalendarCheck />
          <span>Attendance Monitor</span>
        </div>

        <div className="action-card" onClick={() => navigate("/admin/settings")}>
          <FaCog />
          <span>System Settings</span>
        </div>
      </div>

      {/* ===== SYSTEM ALERTS ===== */}
      <h3 className="section-title">System Alerts</h3>

      <div className="admin-alerts">
        {stats.pending_od > 0 && (
          <div className="alert-card warning">
            <FaClipboardList /> {stats.pending_od} OD requests pending
          </div>
        )}

        {stats.days_left !== null && (
          <div className="alert-card">
            <FaClock /> Semester ends in {stats.days_left} days
          </div>
        )}

        <div className="alert-card">
          <FaQrcode /> Dynamic QR enabled
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
