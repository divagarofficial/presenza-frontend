import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

/* ===== PUBLIC ===== */
import Home from "./pages/Home";
import AdminLogin from "./pages/AdminLogin";
import AdminRegister from "./pages/AdminRegister";
import StudentLogin from "./pages/StudentLogin";
import Footer from "./components/Footer";

/* ===== STUDENT / CR ===== */
import StudentDashboardLayout from "./layouts/StudentDashboardLayout";
import StudentHome from "./pages/student/StudentHome";
import Attendance from "./pages/student/Attendance";
import Reports from "./pages/student/Reports";
import Grievance from "./pages/student/Grievance";
import MyQR from "./pages/student/MyQR";
import Credits from "./pages/Credits";

/* ===== CR ===== */
import CRDashboard from "./pages/cr/CRDashboard";
import CRScanAttendance from "./pages/cr/CRScanAttendance";
import CRODApproval from "./pages/cr/CRODApproval";
import CRGrievances from "./pages/cr/CRGrievances";
import CRScanPage from "./pages/cr/CRScanPage";

/* ===== ADMIN ===== */
import AdminDashboardLayout from "./layouts/AdminDashboardLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import StudentRegister from "./pages/admin/StudentRegister";
import AdminDynamicQR from "./pages/admin/AdminDynamicQR";
import SemesterManagement from "./pages/admin/SemesterManagement";
import TimetableManagement from "./pages/admin/TimetableManagement";
import CRControl from "./pages/admin/CRControl";
import AttendanceMonitoring from "./pages/admin/AttendanceMonitoring";
import AdminGrievances from "./pages/admin/AdminGrievances";
import SystemConfiguration from "./pages/admin/SystemConfiguration";  
// (we’ll add more admin pages later)

function App() {
  return (
    <BrowserRouter>
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <Routes>

          {/* ================= PUBLIC ================= */}
          <Route path="/" element={<Home />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/register" element={<AdminRegister />} />
          <Route path="/student/login" element={<StudentLogin />} />

          {/* ================= ADMIN ================= */}
          <Route path="/admin" element={<AdminDashboardLayout />}>
            {/* default → dashboard */}
            <Route index element={<Navigate to="dashboard" replace />} />

            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="students" element={<StudentRegister />} />
            <Route path="admin-qr" element={<AdminDynamicQR />} />
            <Route path="timetable" element={<TimetableManagement />} />
            <Route path="cr-control" element={<CRControl />} />
            <Route path="attendance-monitoring" element={<AttendanceMonitoring />} />
            <Route path="grievances" element={<AdminGrievances />} />
            <Route path="settings" element={<SystemConfiguration />} />



            {/* placeholders – will build later */}
            <Route path="qr" element={<div>Dynamic QR</div>} />
            <Route path="timetable" element={<div>Timetable</div>} />
            <Route path="semester" element={<SemesterManagement />} />
            <Route path="cr-control" element={<div>CR Control</div>} />
            <Route path="attendance" element={<div>Attendance Monitor</div>} />
            <Route path="grievances" element={<div>Grievances</div>} />
            <Route path="audit" element={<div>Audit & Reports</div>} />
            <Route path="settings" element={<div>System Settings</div>} />
            <Route path="credits" element={<Credits />} />
          </Route>

          {/* ================= STUDENT + CR ================= */}
          <Route path="/student" element={<StudentDashboardLayout />}>
            {/* default → dashboard */}
            <Route index element={<Navigate to="dashboard" replace />} />

            {/* STUDENT */}
            <Route path="dashboard" element={<StudentHome />} />
            <Route path="attendance" element={<Attendance />} />
            <Route path="reports" element={<Reports />} />
            <Route path="qr" element={<MyQR />} />
            <Route path="grievance" element={<Grievance />} />
            <Route path="credits" element={<Credits />} />

            {/* CR */}
            <Route path="cr/dashboard" element={<CRDashboard />} />
            <Route path="cr/scan-attendance" element={<CRScanAttendance />} />
            
            <Route path="cr/od" element={<CRODApproval />} />
            <Route path="cr/grievances" element={<CRGrievances />} />
            <Route path="cr/scan" element={<CRScanPage />} />
          </Route>

        </Routes>

        {/* ================= GLOBAL FOOTER ================= */}
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
