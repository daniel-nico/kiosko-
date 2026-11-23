import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Layout() {
  const { usuario, logout } = useAuth();

  return (
    <>
      <header className="barra">
        <div className="barra__contenido">
          <span className="barra__marca">🛒 Kiosco</span>
          <nav className="barra__nav">
            <NavLink to="/" end>
              Inventario
            </NavLink>
            {usuario?.rol === "admin" && (
              <NavLink to="/categorias">Categorías</NavLink>
            )}
            <div className="barra__usuario">
              <span>{usuario?.nombre}</span>
              <span className="badge-rol">{usuario?.rol}</span>
              <button className="boton boton--secundario boton--chico" onClick={logout}>
                Salir
              </button>
            </div>
          </nav>
        </div>
      </header>

      <main className="contenedor">
        <Outlet />
      </main>
    </>
  );
}
