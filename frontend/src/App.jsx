import { Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute";
import Dashboard from "../pages/Dashboard";
import AddTask from "../pages/AddTask";
import Login from "../pages/Login";
import Register from "../pages/Register";
import { hasAuthToken } from "../services/api";

function App() {
  const isAuthenticated = hasAuthToken();

  return (
    <Routes>
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/" replace /> : <Login />}
      />
      <Route
        path="/register"
        element={isAuthenticated ? <Navigate to="/" replace /> : <Register />}
      />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/add"
        element={
          <ProtectedRoute>
            <AddTask />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
