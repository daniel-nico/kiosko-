import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Layout() {
  const { usuario, logout } = useAuth();

  return (
    <>
      <header className="barra">
        <strong>Kiosco - Inventario</strong>
        <nav>
          <NavLink to="/" end>
            Inventario
          </NavLink>
          {usuario?.rol === "admin" && (
            <NavLink to="/categorias">Categorías</NavLink>
          )}
          <span>
            {usuario?.nombre} ({usuario?.rol})
          </span>
          <button className="boton boton--secundario" onClick={logout}>
            Salir
          </button>
        </nav>
      </header>

      <main className="contenedor">
        <Outlet />
      </main>
    </>
  );
}
