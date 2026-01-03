import { Outlet, NavLink, useNavigate } from "react-router-dom";
import {
  FaHome,
  FaCalendarCheck,
  FaChartBar,
  FaQrcode,
  FaExclamationCircle,
  FaSignOutAlt,
  FaBars,
  FaInfoCircle,
  FaUserShield,
  FaClipboardList,
  FaEdit,
} from "react-icons/fa";
import { useState } from "react";
import presenzaLogo from "../assets/presenza-logo.png";
import minduraLogo from "../assets/mindura-logo.png";

function StudentDashboardLayout() {
  const navigate = useNavigate(); // ✅ FIX
  const [collapsed, setCollapsed] = useState(
    window.innerWidth < 768
  );

  const handleLogout = () => {
    localStorage.clear();
    navigate("/student/login", { replace: true }); // ✅ HARD REDIRECT
  };

  const handleNavClick = () => {
    setCollapsed(true);
  };

  // 🔐 CR FLAG
  const isCR = localStorage.getItem("is_cr") === "true";

  return (
    <div className="dashboard">
      {/* ===== SIDEBAR ===== */}
      {!collapsed && (
        <aside className="sidebar">
          {/* BRAND */}
          <div className="sidebar-brand">
            <img src={presenzaLogo} alt="Presenza" />
            <h3>PRESENZA</h3>
          </div>

          {/* NAVIGATION */}
          <nav className="sidebar-nav">
            <NavLink to="/student/dashboard" onClick={handleNavClick}>
              <FaHome /> Dashboard
            </NavLink>

            <NavLink to="/student/attendance" onClick={handleNavClick}>
              <FaCalendarCheck /> Attendance
            </NavLink>

            <NavLink to="/student/reports" onClick={handleNavClick}>
              <FaChartBar /> Reports
            </NavLink>

            <NavLink to="/student/qr" onClick={handleNavClick}>
              <FaQrcode /> My QR
            </NavLink>

            <NavLink to="/student/grievance" onClick={handleNavClick}>
              <FaExclamationCircle /> Grievance
            </NavLink>

            {/* ===== CR SECTION ===== */}
            {isCR && (
              <>
                <div className="sidebar-divider">CR Panel</div>

                <NavLink to="/student/cr/dashboard" onClick={handleNavClick}>
                  <FaUserShield /> CR Dashboard
                </NavLink>

                <NavLink
                  to="/student/cr/scan-attendance"
                  onClick={handleNavClick}
                >
                  <FaQrcode /> Scan Attendance
                </NavLink>

                <NavLink
                  to="/student/cr/manual-attendance"
                  onClick={handleNavClick}
                >
                  <FaEdit /> Manual Attendance
                </NavLink>

                <NavLink to="/student/cr/od" onClick={handleNavClick}>
                  <FaClipboardList /> OD Requests
                </NavLink>

                <NavLink to="/student/cr/grievances" onClick={handleNavClick}>
                  <FaExclamationCircle /> Class Grievances
                </NavLink>
              </>
            )}

            <NavLink to="/student/credits" onClick={handleNavClick}>
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

export default StudentDashboardLayout;
