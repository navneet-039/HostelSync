import { Navigate } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "../context/authContext";

export default function ProtectedRoute({ children }) {
  const { accessToken, loading } = useContext(AuthContext);

  if (loading) return <p>Loading...</p>;
  if (!accessToken) return <Navigate to="/login" replace />;

  return children;
}
