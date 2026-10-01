import { Route, Routes } from 'react-router-dom';
import App from './App';
import AdminLoginPage from './admin/AdminLoginPage';
import AdminDashboardPage from './admin/AdminDashboardPage';
import AdminProtectedRoute from './admin/AdminProtectedRoute';

/** Keeps the existing customer-facing site exactly as-is at "/", adds admin routes alongside it. */
const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<App />} />
    <Route path="/admin/login" element={<AdminLoginPage />} />
    <Route
      path="/admin/bookings"
      element={
        <AdminProtectedRoute>
          <AdminDashboardPage />
        </AdminProtectedRoute>
      }
    />
  </Routes>
);

export default AppRoutes;
