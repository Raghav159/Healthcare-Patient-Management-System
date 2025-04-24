import { BrowserRouter as Router, Routes, Route, NavLink } from "react-router-dom";
import Patients from "./pages/Patients";
import Doctors from "./pages/Doctors";
import Appointments from "./pages/Appointments";
import MedicalHistories from "./pages/MedicalHistories";
import { FaUserInjured, FaUserMd, FaCalendarAlt, FaNotesMedical } from "react-icons/fa";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="app-container">
        {/* Navigation Sidebar */}
        <nav className="app-sidebar">
          <div className="sidebar-header">
            <h1 className="app-title">
              <span className="healthcare-text">Healthcare</span>
              <span className="management-text">Patient Management</span>
            </h1>
          </div>

          <div className="nav-links">
            <NavLink
              to="/"
              className={({ isActive }: { isActive: boolean }) =>
                isActive ? "nav-link active" : "nav-link"
              }
            >
              <FaUserInjured className="nav-icon" />
              <span>Patients</span>
            </NavLink>

            <NavLink
              to="/doctors"
              className={({ isActive }: { isActive: boolean }) =>
                isActive ? "nav-link active" : "nav-link"
              }
            >
              <FaUserMd className="nav-icon" />
              <span>Doctors</span>
            </NavLink>

            <NavLink
              to="/appointments"
              className={({ isActive }: { isActive: boolean }) =>
                isActive ? "nav-link active" : "nav-link"
              }
            >
              <FaCalendarAlt className="nav-icon" />
              <span>Appointments</span>
            </NavLink>

            <NavLink
              to="/medical-histories"
              className={({ isActive }: { isActive: boolean }) =>
                isActive ? "nav-link active" : "nav-link"
              }
            >
              <FaNotesMedical className="nav-icon" />
              <span>Medical Histories</span>
            </NavLink>
          </div>

          <div className="sidebar-footer">
            <div className="user-profile">
              <div className="avatar">AD</div>
              <div className="user-info">
                <span className="username">Admin User</span>
                <span className="user-role">System Administrator</span>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content Area */}
        <main className="main-content">
          <div className="content-header">
            <h2 className="page-title">Dashboard</h2>
            <div className="header-actions">
              <button className="notification-btn">
                <span className="badge">3</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                  <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                </svg>
              </button>
              <div className="user-menu">
                <div className="avatar-sm">AD</div>
              </div>
            </div>
          </div>

          <div className="content-container">
            <Routes>
              <Route path="/" element={<Patients />} />
              <Route path="/doctors" element={<Doctors />} />
              <Route path="/appointments" element={<Appointments />} />
              <Route path="/medical-histories" element={<MedicalHistories />} />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
}

export default App;
