// src/pages/EmployeeDashboardLayout.tsx
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import commonStyles from "../styles/common.module.css";
import styles from "./EmployeeDashboardLayout.module.css";

function EmployeeDashboardLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const getNavLinkClass = ({ isActive }: { isActive: boolean }): string => {
    return isActive ? `${styles.navLink} ${styles.activeLink}` : styles.navLink;
  };

  return (
    <div
      className={commonStyles.container}
      style={{ display: "flex", flexDirection: "column" /* Example min height */ }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexShrink: 0
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
          <h2 style={{ margin: 0, lineHeight: "1.2" }}>Employee Dashboard</h2>
          <p style={{ margin: 0 }}>Welcome, {user?.email}</p>
        </div>
        <button onClick={handleLogout} className={commonStyles.button}>
          Logout
        </button>
      </div>
      <div
        style={{
          backgroundColor: "black",
          height: "1px",
          margin: "15px 0px 10px 0px",
          width: "100%",
          flexShrink: 0
        }}
      />
      <nav className={styles.navTabs} style={{ flexShrink: 0 }}>
        <NavLink to="/employee" end className={getNavLinkClass}>
          Home
        </NavLink>
        <NavLink to="/employee/survey" className={getNavLinkClass}>
          Take Survey
        </NavLink>
        <NavLink to="/employee/history" className={getNavLinkClass}>
          View History
        </NavLink>
      </nav>
      <div
        style={{
          backgroundColor: "black",
          height: "1px",
          margin: "15px 0px 0px 0px",
          width: "100%",
          flexShrink: 0
        }}
      />
      <div style={{ flexGrow: 1, minHeight: 0 }}>
        <Outlet />
      </div>
    </div>
  );
}

export default EmployeeDashboardLayout;
