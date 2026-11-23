import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
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
      await login(datos.nombre, datos.password);
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
        <h2>Iniciar sesión</h2>
        <p className="auth-subtitulo">Ingresá para gestionar el inventario del kiosco</p>
        <form onSubmit={manejarEnvio} className="auth-formulario">
          <label className="campo">
            Usuario
            <input
              name="nombre"
              value={datos.nombre}
              onChange={manejarCambio}
              placeholder="Tu usuario"
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
            {enviando ? "Ingresando..." : "Ingresar"}
          </button>
        </form>
        <p className="auth-pie">
          ¿No tenés cuenta? <Link to="/registro">Registrate</Link>
        </p>
      </div>
    </main>
  );
}
