import { Navigate, Outlet } from 'react-router';
import { useAuth } from '../contexts/AuthContext';

export function ProtectedRoute() {
  const { user, loading } = useAuth();

  if (loading) return null;

  if (user === null) {
    return <Navigate to='/login' replace />;
  }

  return (
    <>
      <Outlet />
    </>
  );
}

export default ProtectedRoute;
