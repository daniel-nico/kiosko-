import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useProductos } from "../hooks/useProductos";
import * as categoriasService from "../services/categorias";
import FormularioProducto from "../components/FormularioProducto";

export default function Inventario() {
  const { usuario } = useAuth();
  const esAdmin = usuario?.rol === "admin";
  const {
    productos,
    cargando,
    error,
    crear,
    actualizar,
    cambiarStock,
    eliminar,
  } = useProductos();

  const [categorias, setCategorias] = useState([]);
  const [buscar, setBuscar] = useState("");
  const [categoriaFiltro, setCategoriaFiltro] = useState("");
  const [editando, setEditando] = useState(null);
  const [errorAccion, setErrorAccion] = useState(null);

  useEffect(() => {
    const controlador = new AbortController();
    categoriasService
      .listar(controlador.signal)
      .then(setCategorias)
      .catch(() => {});
    return () => controlador.abort();
  }, []);

  // Lista filtrada calculada directamente sin estado extra
  const visibles = productos.filter((p) => {
    const coincideTexto = p.nombre.toLowerCase().includes(buscar.toLowerCase());
    const coincideCat =
      !categoriaFiltro || String(p.categoria_id) === categoriaFiltro;
    return coincideTexto && coincideCat;
  });

  async function manejarGuardar(datos) {
    if (editando) {
      await actualizar(editando.id, datos);
      setEditando(null);
    } else {
      await crear(datos);
    }
  }

  async function ejecutar(accion) {
    setErrorAccion(null);
    try {
      await accion();
    } catch (e) {
      setErrorAccion(e.message);
    }
  }

  if (cargando) return <p>Cargando inventario...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <>
      <h2>Inventario de Productos</h2>

      {esAdmin && (
        <>
          <h3>{editando ? "Editar producto" : "Nuevo producto"}</h3>
          <FormularioProducto
            key={editando ? editando.id : "nuevo"}
            inicial={editando || undefined}
            categorias={categorias}
            onGuardar={manejarGuardar}
            onCancelar={editando ? () => setEditando(null) : null}
          />
        </>
      )}

      <div style={{ display: "flex", gap: "12px", marginBottom: "16px" }}>
        <input
          type="search"
          placeholder="Buscar producto..."
          value={buscar}
          onChange={(e) => setBuscar(e.target.value)}
          style={{ padding: "8px", flex: 1 }}
        />
        <select
          value={categoriaFiltro}
          onChange={(e) => setCategoriaFiltro(e.target.value)}
          style={{ padding: "8px" }}
        >
          <option value="">Todas las categorías</option>
          {categorias.map((c) => (
            <option key={c.id} value={c.id}>
              {c.nombre}
            </option>
          ))}
        </select>
      </div>

      {errorAccion && <p className="error">{errorAccion}</p>}

      <table className="tabla">
        <thead>
          <tr>
            <th>Producto</th>
            <th>Categoría</th>
            <th>Precio</th>
            <th>Stock</th>
            <th>Estado</th>
            {esAdmin && <th>Acciones</th>}
          </tr>
        </thead>
        <tbody>
          {visibles.map((prod) => (
            <tr key={prod.id}>
              <td>{prod.nombre}</td>
              <td>{prod.categoria}</td>
              <td>${Number(prod.precio).toFixed(2)}</td>
              <td>
                <button
                  className="boton boton--secundario"
                  disabled={prod.stock <= 0}
                  onClick={() =>
                    ejecutar(() => cambiarStock(prod.id, prod.stock - 1))
                  }
                >
                  -
                </button>
                <strong style={{ margin: "0 10px" }}>{prod.stock}</strong>
                <button
                  className="boton"
                  onClick={() =>
                    ejecutar(() => cambiarStock(prod.id, prod.stock + 1))
                  }
                >
                  +
                </button>
              </td>
              <td>
                {prod.alerta_stock ? (
                  <span className="alerta-stock">
                    Stock bajo (mín. {prod.stock_minimo})
                  </span>
                ) : (
                  "OK"
                )}
              </td>
              {esAdmin && (
                <td style={{ display: "flex", gap: "6px" }}>
                  <button
                    className="boton boton--secundario"
                    onClick={() => setEditando(prod)}
                  >
                    Editar
                  </button>
                  <button
                    className="boton boton--peligro"
                    onClick={() => {
                      if (window.confirm(`¿Eliminar ${prod.nombre}?`)) {
                        ejecutar(() => eliminar(prod.id));
                      }
                    }}
                  >
                    Borrar
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
