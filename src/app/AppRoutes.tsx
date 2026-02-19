import { Routes, Route } from "react-router-dom";
import Dashboard from "../features/dashboard/Dashboard";
import Daily from "../features/tasks/Daily";
import Monthly from "../features/tasks/Monthly";
import MainLayout from "../layouts/MainLayout";
import ProtectedRoute from "../components/common/ProtectedRoute";
import Login from "../features/auth/Login";
import Register from "../features/auth/Register";
import Settings from "../features/settings/Settings";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/daily" element={<Daily />} />
        <Route path="/daily/:date" element={<Daily />} />
        <Route path="/monthly" element={<Monthly />} />
        <Route path="/settings" element={<Settings />} />
      </Route>
    </Routes>
  );
}
