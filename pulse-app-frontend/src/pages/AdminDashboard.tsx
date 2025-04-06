// src/pages/AdminDashboard.tsx
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AdminSubmissionsTable from "../components/AdminSubmissionsTable";
import ExportButtons from "../components/ExportButtons";
import commonStyles from "../styles/common.module.css";

function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className={commonStyles.container} style={{ display: "flex", flexDirection: "column" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexShrink: 0
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <h2 style={{ margin: 0, lineHeight: "1.2" }}>Admin Dashboard</h2>
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
      <div style={{ flexShrink: 0 }}>
        <ExportButtons />
      </div>
      <div
        style={{
          backgroundColor: "black",
          height: "1px",
          margin: "10px 0px 0px 0px",
          width: "100%",
          flexShrink: 0
        }}
      />
      <hr style={{ flexShrink: 0 }} />
      <h4 style={{ margin: "0px 0px 15px 0px", lineHeight: "1" }}>All Employee Submissions</h4>
      <div style={{ flexGrow: 1, minHeight: 0, overflowY: "auto" }}>
        <AdminSubmissionsTable />
      </div>
    </div>
  );
}

export default AdminDashboard;
