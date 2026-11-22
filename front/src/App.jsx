import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import RutaProtegida from "./components/RutaProtegida";
import Login from "./pages/Login";
import Registro from "./pages/Registro";
import Inventario from "./pages/Inventario";
import Categorias from "./pages/Categorias";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/registro" element={<Registro />} />

      <Route
        element={
          <RutaProtegida>
            <Layout />
          </RutaProtegida>
        }
      >
        <Route path="/" element={<Inventario />} />
        <Route
          path="/categorias"
          element={
            <RutaProtegida soloAdmin>
              <Categorias />
            </RutaProtegida>
          }
        />
      </Route>

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}
