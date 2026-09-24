import { Routes, Route, Navigate } from 'react-router-dom';
import AppShell from './components/layout/AppShell';
import Dashboard from './pages/Dashboard';
import EmployeeDirectory from './pages/EmployeeDirectory';
import EmployeeDetail from './pages/EmployeeDetail';
import AddEmployee from './pages/AddEmployee';
import ImportCenter from './pages/ImportCenter';
import Reports from './pages/Reports';

export default function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <AppShell title="Dashboard" subtitle="Live snapshot from /api/employees">
            <Dashboard />
          </AppShell>
        }
      />
      <Route
        path="/employees"
        element={
          <AppShell title="Employee Directory" subtitle="All employees from /api/employees">
            <EmployeeDirectory />
          </AppShell>
        }
      />
      <Route
        path="/employees/new"
        element={
          <AppShell title="Add Employee" subtitle="Creates a record via POST /api/employees">
            <AddEmployee />
          </AppShell>
        }
      />
      <Route
        path="/employees/:employeeCode"
        element={
          <AppShell title="Employee Detail" subtitle="Single record from /api/employees/{code}">
            <EmployeeDetail />
          </AppShell>
        }
      />
      <Route
        path="/import"
        element={
          <AppShell title="Import Center" subtitle="Bulk import via /api/employees/import">
            <ImportCenter />
          </AppShell>
        }
      />
      <Route
        path="/reports"
        element={
          <AppShell title="Reports" subtitle="Operational analytics from /api/reports">
            <Reports />
          </AppShell>
        }
      />
      {/* Insights is Stage 4+ and intentionally not routed yet. */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
