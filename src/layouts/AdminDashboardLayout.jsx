import { Outlet, NavLink, useNavigate } from "react-router-dom";
import {
  FaHome,
  FaUserGraduate,
  FaQrcode,
  FaTable,
  FaCalendarAlt,
  FaUserShield,
  FaChartLine,
  FaExclamationCircle,
  FaCog,
  FaInfoCircle,
  FaSignOutAlt,
  FaBars,
} from "react-icons/fa";
import { useState } from "react";
import presenzaLogo from "../assets/presenza-logo.png";
import minduraLogo from "../assets/mindura-logo.png";

function AdminDashboardLayout() {
  const navigate = useNavigate(); // ✅ ensure navigate exists

  const [collapsed, setCollapsed] = useState(
    window.innerWidth < 768
  );

  const handleNavClick = () => {
    setCollapsed(true);
  };

  const handleLogout = () => {
    localStorage.clear();

    // ✅ HARD LOGOUT REDIRECT
    navigate("/admin/login", { replace: true });
  };

  return (
    <div className="dashboard">
      {/* ===== SIDEBAR ===== */}
      {!collapsed && (
        <aside className="sidebar">
          {/* BRAND */}
          <div className="sidebar-brand">
            <img src={presenzaLogo} alt="Presenza" />
            <h3>PRESENZA</h3>
            <span className="role-badge">ADMIN</span>
          </div>

          {/* NAV */}
          <nav className="sidebar-nav">
            <NavLink to="/admin/dashboard" onClick={handleNavClick}>
              <FaHome /> Dashboard
            </NavLink>

            <NavLink to="/admin/students" onClick={handleNavClick}>
              <FaUserGraduate /> Student Registration
            </NavLink>

            <NavLink to="/admin/admin-qr" onClick={handleNavClick}>
              <FaQrcode /> Dynamic QR
            </NavLink>

            <NavLink to="/admin/timetable" onClick={handleNavClick}>
              <FaTable /> Timetable
            </NavLink>

            <NavLink to="/admin/semester" onClick={handleNavClick}>
              <FaCalendarAlt /> Semester
            </NavLink>

            <NavLink to="/admin/cr-control" onClick={handleNavClick}>
              <FaUserShield /> CR Control
            </NavLink>

            <NavLink
              to="/admin/attendance-monitoring"
              onClick={handleNavClick}
            >
              <FaChartLine /> Attendance Monitor
            </NavLink>

            <NavLink to="/admin/grievances" onClick={handleNavClick}>
              <FaExclamationCircle /> Grievances
            </NavLink>

            <NavLink to="/admin/settings" onClick={handleNavClick}>
              <FaCog /> System Settings
            </NavLink>

            <NavLink to="/admin/credits" onClick={handleNavClick}>
              <FaInfoCircle /> Credits
            </NavLink>
          </nav>

          {/* FOOTER */}
          <div className="sidebar-footer">
            <div className="mindura-logo">
              <img src={minduraLogo} alt="Mindura" />
            </div>

            <button className="logout-btn" onClick={handleLogout}>
              <FaSignOutAlt /> Logout
            </button>

            <div className="mindura-text">
              MINDURA TECHNOLOGIES
            </div>
          </div>
        </aside>
      )}

      {/* ===== MAIN ===== */}
      <div className="dashboard-main">
        <header className="dashboard-header">
          <button
            className="sidebar-toggle"
            onClick={() => setCollapsed(!collapsed)}
          >
            <FaBars />
          </button>
        </header>

        <main className="dashboard-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminDashboardLayout;
