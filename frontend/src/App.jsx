import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import MainLayout from './components/layout/MainLayout';
import LoginPage from './pages/auth/LoginPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import EmployeeListPage from './pages/employees/EmployeeListPage';
import EmployeeFormPage from './pages/employees/EmployeeFormPage';
import EmployeeDetailPage from './pages/employees/EmployeeDetailPage';
import DepartmentPage from './pages/departments/DepartmentPage';
import PositionPage from './pages/positions/PositionPage';
import LeaveListPage from './pages/leaves/LeaveListPage';
import LeaveRequestPage from './pages/leaves/LeaveRequestPage';
import LeaveApprovalPage from './pages/leaves/LeaveApprovalPage';
import PayrollListPage from './pages/payroll/PayrollListPage';
import PayrollRunPage from './pages/payroll/PayrollRunPage';
import PayrollReportPage from './pages/payroll/PayrollReportPage';
import PeriodListPage from './pages/performance/PeriodListPage';
import GoalManagementPage from './pages/performance/GoalManagementPage';
import EvaluationPage from './pages/performance/EvaluationPage';
import AuditLogPage from './pages/audit/AuditLogPage';
import PayrollReportPageNew from './pages/reports/PayrollReportPage';
import EmployeeReportPage from './pages/reports/EmployeeReportPage';
import AnnouncementPage from './pages/announcements/AnnouncementPage';
import ParameterPage from './pages/parameters/ParameterPage';
import LeaveReportPage from './pages/reports/LeaveReportPage';
import OrgChartPage from './pages/organization/OrgChartPage';

function ProtectedRoute({ children, roles }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  const { user } = useAuth();
  if (!user) {
    return (<Routes><Route path="/login" element={<LoginPage />} /><Route path="*" element={<Navigate to="/login" replace />} /></Routes>);
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
        <Route path="/positions" element={<ProtectedRoute roles={['ADMIN','HR_MANAGER']}><PositionPage /></ProtectedRoute>} />
        <Route path="/leaves" element={<ProtectedRoute><LeaveListPage /></ProtectedRoute>} />
        <Route path="/leaves/request" element={<ProtectedRoute><LeaveRequestPage /></ProtectedRoute>} />
        <Route path="/leaves/approvals" element={<ProtectedRoute roles={['ADMIN','HR_MANAGER','MANAGER']}><LeaveApprovalPage /></ProtectedRoute>} />
        <Route path="/payroll" element={<ProtectedRoute roles={['ADMIN','HR_MANAGER','FINANCE']}><PayrollListPage /></ProtectedRoute>} />
        <Route path="/payroll/run" element={<ProtectedRoute roles={['ADMIN','HR_MANAGER']}><PayrollRunPage /></ProtectedRoute>} />
        <Route path="/payroll/reports" element={<ProtectedRoute roles={['ADMIN','HR_MANAGER','FINANCE']}><PayrollReportPage /></ProtectedRoute>} />
        <Route path="/performance/periods" element={<ProtectedRoute roles={['ADMIN','HR_MANAGER']}><PeriodListPage /></ProtectedRoute>} />
        <Route path="/performance/goals" element={<ProtectedRoute><GoalManagementPage /></ProtectedRoute>} />
        <Route path="/performance/evaluations" element={<ProtectedRoute><EvaluationPage /></ProtectedRoute>} />
        <Route path="/organization" element={<ProtectedRoute><OrgChartPage /></ProtectedRoute>} />
        <Route path="/reports/leaves" element={<ProtectedRoute roles={['ADMIN','HR_MANAGER']}><LeaveReportPage /></ProtectedRoute>} />
        <Route path="/announcements" element={<ProtectedRoute roles={['ADMIN','HR_MANAGER']}><AnnouncementPage /></ProtectedRoute>} />
        <Route path="/parameters" element={<ProtectedRoute roles={['ADMIN','HR_MANAGER']}><ParameterPage /></ProtectedRoute>} />
        <Route path="/reports/payroll" element={<ProtectedRoute roles={['ADMIN','HR_MANAGER','FINANCE']}><PayrollReportPageNew /></ProtectedRoute>} />
        <Route path="/reports/employees" element={<ProtectedRoute roles={['ADMIN','HR_MANAGER']}><EmployeeReportPage /></ProtectedRoute>} />
        <Route path="/audit-logs" element={<ProtectedRoute roles={['ADMIN','HR_MANAGER']}><AuditLogPage /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}