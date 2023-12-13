import { Navigate, Outlet } from 'react-router-dom';

function ProtectedRoutes() {
  return localStorage.auth_token ? <Outlet /> : <Navigate to="/login" />;
}

export default ProtectedRoutes;