import { Navigate } from "react-router-dom";
import { hasAuthToken } from "../services/api";

function ProtectedRoute({ children }) {
  if (!hasAuthToken()) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;
