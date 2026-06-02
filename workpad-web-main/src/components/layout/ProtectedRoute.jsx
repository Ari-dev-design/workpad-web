import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  // esperamos a que termine de comprobar la sesion
  if (loading) return null;

  // si no hay usuario mandamos al login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
