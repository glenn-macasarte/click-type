import { Navigate, Outlet } from 'react-router-dom';

function OpenRoutes() {
  return localStorage.auth_token ? <Navigate to="/" /> : <Outlet />;
}

export default OpenRoutes;