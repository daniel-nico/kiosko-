import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Registro() {
  const { registro } = useAuth();
  const navigate = useNavigate();
  const [datos, setDatos] = useState({ nombre: "", password: "" });
  const [error, setError] = useState(null);
  const [enviando, setEnviando] = useState(false);

  function manejarCambio(e) {
    const { name, value } = e.target;
    setDatos((anteriores) => ({ ...anteriores, [name]: value }));
  }

  async function manejarEnvio(e) {
    e.preventDefault();
    setError(null);
    setEnviando(true);
    try {
      await registro(datos.nombre, datos.password);
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <main className="auth-pantalla">
      <div className="auth-tarjeta">
        <div className="auth-icono">🛒</div>
        <h2>Crear cuenta</h2>
        <p className="auth-subtitulo">Registrate para acceder al inventario del kiosco</p>
        <form onSubmit={manejarEnvio} className="auth-formulario">
          <label className="campo">
            Usuario
            <input
              name="nombre"
              value={datos.nombre}
              onChange={manejarCambio}
              placeholder="Elegí un usuario"
              required
            />
          </label>
          <label className="campo">
            Contraseña
            <input
              type="password"
              name="password"
              value={datos.password}
              onChange={manejarCambio}
              placeholder="••••••••"
              required
            />
          </label>
          {error && <p className="error">{error}</p>}
          <button className="boton boton--completo" disabled={enviando}>
            {enviando ? "Creando..." : "Registrarse"}
          </button>
        </form>
        <p className="auth-pie">
          ¿Ya tenés cuenta? <Link to="/login">Iniciá sesión</Link>
        </p>
      </div>
    </main>
  );
}
