import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import MainLayout from './components/layout/MainLayout';
import LoginPage from './pages/auth/LoginPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import EmployeeListPage from './pages/employees/EmployeeListPage';
import EmployeeFormPage from './pages/employees/EmployeeFormPage';
import EmployeeDetailPage from './pages/employees/EmployeeDetailPage';
import DepartmentPage from './pages/departments/DepartmentPage';
import LeaveListPage from './pages/leaves/LeaveListPage';
import LeaveRequestPage from './pages/leaves/LeaveRequestPage';
import LeaveApprovalPage from './pages/leaves/LeaveApprovalPage';
import PayrollListPage from './pages/payroll/PayrollListPage';
import PayrollRunPage from './pages/payroll/PayrollRunPage';
import PayrollReportPage from './pages/payroll/PayrollReportPage';
import PeriodListPage from './pages/performance/PeriodListPage';
import GoalManagementPage from './pages/performance/GoalManagementPage';
import EvaluationPage from './pages/performance/EvaluationPage';

function ProtectedRoute({ children, roles }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  const { user } = useAuth();

  if (!user) {
    return (
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route path="/login" element={<Navigate to="/" replace />} />
      <Route element={<MainLayout />}>
        <Route path="/" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        <Route path="/employees" element={<ProtectedRoute roles={['ADMIN','HR_MANAGER','MANAGER']}><EmployeeListPage /></ProtectedRoute>} />
        <Route path="/employees/new" element={<ProtectedRoute roles={['ADMIN','HR_MANAGER']}><EmployeeFormPage /></ProtectedRoute>} />
        <Route path="/employees/:id" element={<ProtectedRoute><EmployeeDetailPage /></ProtectedRoute>} />
        <Route path="/departments" element={<ProtectedRoute roles={['ADMIN','HR_MANAGER']}><DepartmentPage /></ProtectedRoute>} />
        <Route path="/leaves" element={<ProtectedRoute><LeaveListPage /></ProtectedRoute>} />
        <Route path="/leaves/request" element={<ProtectedRoute><LeaveRequestPage /></ProtectedRoute>} />
        <Route path="/leaves/approvals" element={<ProtectedRoute roles={['ADMIN','HR_MANAGER','MANAGER']}><LeaveApprovalPage /></ProtectedRoute>} />
        <Route path="/payroll" element={<ProtectedRoute roles={['ADMIN','HR_MANAGER','FINANCE']}><PayrollListPage /></ProtectedRoute>} />
        <Route path="/payroll/run" element={<ProtectedRoute roles={['ADMIN','HR_MANAGER']}><PayrollRunPage /></ProtectedRoute>} />
        <Route path="/payroll/reports" element={<ProtectedRoute roles={['ADMIN','HR_MANAGER','FINANCE']}><PayrollReportPage /></ProtectedRoute>} />
        <Route path="/performance/periods" element={<ProtectedRoute roles={['ADMIN','HR_MANAGER']}><PeriodListPage /></ProtectedRoute>} />
        <Route path="/performance/goals" element={<ProtectedRoute><GoalManagementPage /></ProtectedRoute>} />
        <Route path="/performance/evaluations" element={<ProtectedRoute><EvaluationPage /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
