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
    <main className="contenedor" style={{ maxWidth: "400px" }}>
      <h2>Crear cuenta</h2>
      <form onSubmit={manejarEnvio} className="formulario">
        <label className="campo">
          Usuario
          <input
            name="nombre"
            value={datos.nombre}
            onChange={manejarCambio}
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
            required
          />
        </label>
        {error && <p className="error">{error}</p>}
        <button className="boton" disabled={enviando}>
          {enviando ? "Creando..." : "Registrarse"}
        </button>
      </form>
      <p>
        ¿Ya tenés cuenta? <Link to="/login">Iniciá sesión</Link>
      </p>
    </main>
  );
}
