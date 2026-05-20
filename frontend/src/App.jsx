import React, { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthContext } from "./context/AuthContext";
import Layout from "./components/Layout";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import EmployeeListPage from "./pages/employees/EmployeeListPage";
import EmployeeDetailPage from "./pages/employees/EmployeeDetailPage";
import EmployeeCreatePage from "./pages/employees/EmployeeCreatePage";
import LeaveListPage from "./pages/leaves/LeaveListPage";
import PerformanceListPage from "./pages/performance/PerformanceListPage";
import ApprovalListPage from "./pages/approvals/ApprovalListPage";

function PrivateRoute({ children }) {
  const { user, loading } = useContext(AuthContext);
  if (loading) return <div className="flex items-center justify-center h-screen">Yükleniyor...</div>;
  return user ? children : <Navigate to="/login" />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/*"
        element={
          <PrivateRoute>
            <Layout>
              <Routes>
                <Route path="/" element={<DashboardPage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/employees" element={<EmployeeListPage />} />
                <Route path="/employees/new" element={<EmployeeCreatePage />} />
                <Route path="/employees/:id" element={<EmployeeDetailPage />} />
                <Route path="/leaves" element={<LeaveListPage />} />
                <Route path="/performance" element={<PerformanceListPage />} />
                <Route path="/approvals" element={<ApprovalListPage />} />
              </Routes>
            </Layout>
          </PrivateRoute>
        }
      />
    </Routes>
  );
}
