import { useState } from "react";

const VACIO = {
  nombre: "",
  precio: "",
  stock: 0,
  stock_minimo: 5,
  categoria_id: "",
};

export default function FormularioProducto({
  inicial = VACIO,
  categorias,
  onGuardar,
  onCancelar,
}) {
  const [datos, setDatos] = useState(inicial);
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
      await onGuardar(datos);
      setDatos(VACIO);
    } catch (err) {
      setError(err.message);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <form onSubmit={manejarEnvio} className="formulario">
      <label className="campo">
        Nombre
        <input
          name="nombre"
          value={datos.nombre}
          onChange={manejarCambio}
          required
        />
      </label>

      <label className="campo">
        Categoría
        <select
          name="categoria_id"
          value={datos.categoria_id}
          onChange={manejarCambio}
          required
        >
          <option value="">Seleccionar categoría...</option>
          {categorias.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.nombre}
            </option>
          ))}
        </select>
      </label>

      <label className="campo">
        Precio
        <input
          type="number"
          step="0.01"
          min="0"
          name="precio"
          value={datos.precio}
          onChange={manejarCambio}
          required
        />
      </label>

      <label className="campo">
        Stock actual
        <input
          type="number"
          min="0"
          name="stock"
          value={datos.stock}
          onChange={manejarCambio}
          required
        />
      </label>

      <label className="campo">
        Stock mínimo (alerta)
        <input
          type="number"
          min="0"
          name="stock_minimo"
          value={datos.stock_minimo}
          onChange={manejarCambio}
          required
        />
      </label>

      {error && <p className="error">{error}</p>}

      <div style={{ display: "flex", gap: "8px" }}>
        <button className="boton" disabled={enviando}>
          {enviando ? "Guardando..." : "Guardar"}
        </button>
        {onCancelar && (
          <button
            type="button"
            className="boton boton--secundario"
            onClick={onCancelar}
          >
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
}
