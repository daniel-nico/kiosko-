import { useEffect, useState } from "react";
import * as categoriasService from "../services/categorias";

export default function Categorias() {
  const [categorias, setCategorias] = useState([]);
  const [nombre, setNombre] = useState("");
  const [editandoId, setEditandoId] = useState(null);
  const [error, setError] = useState(null);

  async function cargar(signal) {
    try {
      const datos = await categoriasService.listar(signal);
      setCategorias(datos);
    } catch (e) {
      if (e.name !== "AbortError") setError(e.message);
    }
  }

  useEffect(() => {
    const controlador = new AbortController();
    cargar(controlador.signal);
    return () => controlador.abort();
  }, []);

  async function manejarEnvio(e) {
    e.preventDefault();
    if (!nombre.trim()) return;
    setError(null);
    try {
      if (editandoId) {
        await categoriasService.actualizar(editandoId, nombre.trim());
        setEditandoId(null);
      } else {
        await categoriasService.crear(nombre.trim());
      }
      setNombre("");
      await cargar();
    } catch (err) {
      setError(err.message);
    }
  }

  async function manejarEliminar(id) {
    setError(null);
    try {
      await categoriasService.eliminar(id);
      setCategorias((actuales) => actuales.filter((c) => c.id !== id));
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <>
      <h2>Gestión de Categorías</h2>

      <form onSubmit={manejarEnvio} className="formulario">
        <label className="campo">
          {editandoId ? "Editar categoría" : "Nueva categoría"}
          <input
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />
        </label>
        {error && <p className="error">{error}</p>}
        <div style={{ display: "flex", gap: "8px" }}>
          <button className="boton">
            {editandoId ? "Actualizar" : "Agregar"}
          </button>
          {editandoId && (
            <button
              type="button"
              className="boton boton--secundario"
              onClick={() => {
                setEditandoId(null);
                setNombre("");
              }}
            >
              Cancelar
            </button>
          )}
        </div>
      </form>

      <table className="tabla">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {categorias.map((cat) => (
            <tr key={cat.id}>
              <td>{cat.nombre}</td>
              <td style={{ display: "flex", gap: "6px" }}>
                <button
                  className="boton boton--secundario"
                  onClick={() => {
                    setEditandoId(cat.id);
                    setNombre(cat.nombre);
                  }}
                >
                  Editar
                </button>
                <button
                  className="boton boton--peligro"
                  onClick={() => manejarEliminar(cat.id)}
                >
                  Borrar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
