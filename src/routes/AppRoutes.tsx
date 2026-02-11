import { Routes, Route } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import Daily from "../pages/Daily";
import Monthly from "../pages/Monthly";
import MainLayout from "../layouts/MainLayout";

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/daily" element={<Daily />} />
        <Route path="/daily/:date" element={<Daily />} />
        <Route path="/monthly" element={<Monthly />} />
      </Route>
    </Routes>
  );
}
