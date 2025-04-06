import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link, // Keep Link for NotFound page
  Navigate,
  // Remove Outlet, useNavigate as they are now used in sub-components
} from 'react-router-dom';
import './App.css';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuth } from './context/AuthContext';
import { Role } from './enums/role.enum';
import { Toaster } from 'react-hot-toast';
// Import new page components
import EmployeeDashboardLayout from './pages/EmployeeDashboardLayout';
import EmployeeHome from './pages/EmployeeHome';
import TakeSurveyPage from './pages/TakeSurveyPage';
import HistoryPage from './pages/HistoryPage';
import AdminDashboard from './pages/AdminDashboard';
import NotFoundPage from './pages/NotFoundPage';
import commonStyles from './styles/common.module.css'; // Import common styles for spinner

// --- Remove All Inline Page/Layout Components --- 

// Updated Home component
function Home() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    // Use the CSS spinner
    return <div className={commonStyles.loadingSpinner} style={{marginTop: '50px'}}></div>;
  }

  if (user) {
    return <Navigate to={user.role === Role.Admin ? "/admin" : "/employee"} replace />;
  } else {
    return <Navigate to="/login" replace />;
  }
}

function App() {
  return (
    <Router>
      {/* Toaster should be inside Router but outside Routes for context access */}
      <Toaster position="top-center" reverseOrder={false} /> 
      <div className="App">
        <h1>Employee Pulse App</h1>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Employee Routes */}
          <Route element={<ProtectedRoute allowedRoles={[Role.Employee, Role.Admin]} />}>
            <Route path="/employee" element={<EmployeeDashboardLayout />}>
                <Route index element={<EmployeeHome />} />
                <Route path="survey" element={<TakeSurveyPage />} />
                <Route path="history" element={<HistoryPage />} />
            </Route>
          </Route>

          {/* Admin Routes */}
          <Route element={<ProtectedRoute allowedRoles={[Role.Admin]} />}>
            <Route path="/admin" element={<AdminDashboard />} />
          </Route>

          {/* Root path */}
          <Route path="/" element={<Home />} />

          {/* Not Found */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
