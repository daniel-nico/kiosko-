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
  const [pagina, setPagina] = useState(1);
  const POR_PAGINA = 10;

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

  // Paginación (solo visual): muestra 10 productos por página
  const totalPaginas = Math.max(1, Math.ceil(visibles.length / POR_PAGINA));
  const paginaActual = Math.min(pagina, totalPaginas);
  const productosPagina = visibles.slice(
    (paginaActual - 1) * POR_PAGINA,
    paginaActual * POR_PAGINA
  );

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

  if (cargando) return <p className="vacio">Cargando inventario...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <>
      <div className="encabezado-pagina">
        <h2>Inventario de productos</h2>
      </div>

      {esAdmin && (
        <section className="tarjeta">
          <h3>{editando ? "Editar producto" : "Nuevo producto"}</h3>
          <FormularioProducto
            key={editando ? editando.id : "nuevo"}
            inicial={editando || undefined}
            categorias={categorias}
            onGuardar={manejarGuardar}
            onCancelar={editando ? () => setEditando(null) : null}
          />
        </section>
      )}

      <div className="barra-filtros">
        <input
          type="search"
          placeholder="Buscar producto..."
          value={buscar}
          onChange={(e) => {
            setBuscar(e.target.value);
            setPagina(1);
          }}
        />
        <select
          value={categoriaFiltro}
          onChange={(e) => {
            setCategoriaFiltro(e.target.value);
            setPagina(1);
          }}
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

      <div className="tabla-contenedor">
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
            {productosPagina.length === 0 && (
              <tr>
                <td colSpan={esAdmin ? 6 : 5} className="vacio">
                  No hay productos para mostrar
                </td>
              </tr>
            )}
            {productosPagina.map((prod) => (
              <tr key={prod.id}>
                <td>{prod.nombre}</td>
                <td>{prod.categoria}</td>
                <td className="precio">${Number(prod.precio).toFixed(2)}</td>
                <td>
                  <div className="control-stock">
                    <button
                      className="boton boton--secundario boton--chico"
                      disabled={prod.stock <= 0}
                      onClick={() =>
                        ejecutar(() => cambiarStock(prod.id, prod.stock - 1))
                      }
                    >
                      -
                    </button>
                    <strong>{prod.stock}</strong>
                    <button
                      className="boton boton--chico"
                      onClick={() =>
                        ejecutar(() => cambiarStock(prod.id, prod.stock + 1))
                      }
                    >
                      +
                    </button>
                  </div>
                </td>
                <td>
                  {prod.alerta_stock ? (
                    <span className="badge badge--alerta">
                      Stock bajo (mín. {prod.stock_minimo})
                    </span>
                  ) : (
                    <span className="badge badge--ok">OK</span>
                  )}
                </td>
                {esAdmin && (
                  <td>
                    <div className="acciones">
                      <button
                        className="boton boton--secundario boton--chico"
                        onClick={() => setEditando(prod)}
                      >
                        Editar
                      </button>
                      <button
                        className="boton boton--peligro boton--chico"
                        onClick={() => {
                          if (window.confirm(`¿Eliminar ${prod.nombre}?`)) {
                            ejecutar(() => eliminar(prod.id));
                          }
                        }}
                      >
                        Borrar
                      </button>
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="paginacion">
        <span className="paginacion__info">
          {visibles.length} productos · Página {paginaActual} de {totalPaginas}
        </span>
        <div className="paginacion__botones">
          <button
            className="boton boton--secundario boton--chico"
            disabled={paginaActual === 1}
            onClick={() => setPagina(paginaActual - 1)}
          >
            ← Anterior
          </button>
          {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((n) => (
            <button
              key={n}
              className={`paginacion__numero ${n === paginaActual ? "activa" : ""}`}
              onClick={() => setPagina(n)}
            >
              {n}
            </button>
          ))}
          <button
            className="boton boton--secundario boton--chico"
            disabled={paginaActual === totalPaginas}
            onClick={() => setPagina(paginaActual + 1)}
          >
            Siguiente →
          </button>
        </div>
      </div>
    </>
  );
}
