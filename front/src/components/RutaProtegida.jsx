import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function RutaProtegida({ children, soloAdmin = false }) {
  const { usuario } = useAuth();

  if (!usuario) return <Navigate to="/login" />;
  if (soloAdmin && usuario.rol !== "admin") return <Navigate to="/" />;

  return children;
}
