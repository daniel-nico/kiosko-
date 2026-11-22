import { useEffect, useState } from "react";
import * as productosService from "../services/productos";

export function useProductos() {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  async function cargar(signal) {
    try {
      setCargando(true);
      setError(null);
      const datos = await productosService.listar(signal);
      setProductos(datos);
    } catch (e) {
      if (e.name !== "AbortError") setError(e.message);
    } finally {
      if (!signal?.aborted) setCargando(false);
    }
  }

  useEffect(() => {
    const controlador = new AbortController();
    cargar(controlador.signal);
    return () => controlador.abort();
  }, []);

  async function crear(datos) {
    await productosService.crear(datos);
    await cargar();
  }

  async function actualizar(id, datos) {
    await productosService.actualizar(id, datos);
    await cargar();
  }

  async function cambiarStock(id, nuevoStock) {
    await productosService.cambiarStock(id, nuevoStock);
    setProductos((actuales) =>
      actuales.map((p) =>
        p.id === id
          ? {
              ...p,
              stock: nuevoStock,
              alerta_stock: nuevoStock <= p.stock_minimo,
            }
          : p,
      ),
    );
  }

  async function eliminar(id) {
    await productosService.eliminar(id);
    setProductos((actuales) => actuales.filter((p) => p.id !== id));
  }

  return {
    productos,
    cargando,
    error,
    crear,
    actualizar,
    cambiarStock,
    eliminar,
  };
}
