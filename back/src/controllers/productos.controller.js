import * as productosModel from "../models/productos.model.js";

export async function listar(req, res, next) {
  try {
    const productos = await productosModel.listarProductos();
    res.json(productos);
  } catch (error) {
    next(error);
  }
}

export async function crear(req, res, next) {
  try {
    const { nombre, precio, stock, stock_minimo, categoria_id } = req.body;

    if (!nombre || !nombre.trim() || precio === undefined || !categoria_id) {
      return res
        .status(400)
        .json({ error: "Nombre, precio y categoria son obligatorios" });
    }
    if (Number(precio) < 0 || Number(stock) < 0 || Number(stock_minimo) < 0) {
      return res
        .status(400)
        .json({ error: "Precio y stock no pueden ser negativos" });
    }

    const nuevo = await productosModel.crearProducto({
      nombre: nombre.trim(),
      precio: Number(precio),
      stock: Number(stock ?? 0),
      stock_minimo: Number(stock_minimo ?? 5),
      categoria_id: Number(categoria_id),
    });

    res.status(201).json(nuevo);
  } catch (error) {
    if (error.code === "ER_NO_REFERENCED_ROW_2") {
      return res
        .status(400)
        .json({ error: "La categoria seleccionada no existe" });
    }
    next(error);
  }
}

export async function actualizar(req, res, next) {
  try {
    const { nombre, precio, stock, stock_minimo, categoria_id } = req.body;

    if (!nombre || !nombre.trim() || precio === undefined || !categoria_id) {
      return res
        .status(400)
        .json({ error: "Nombre, precio y categoria son obligatorios" });
    }
    if (Number(precio) < 0 || Number(stock) < 0 || Number(stock_minimo) < 0) {
      return res
        .status(400)
        .json({ error: "Precio y stock no pueden ser negativos" });
    }

    const editado = await productosModel.actualizarProducto(req.params.id, {
      nombre: nombre.trim(),
      precio: Number(precio),
      stock: Number(stock),
      stock_minimo: Number(stock_minimo),
      categoria_id: Number(categoria_id),
    });

    if (!editado) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    res.json({ mensaje: "Producto actualizado" });
  } catch (error) {
    if (error.code === "ER_NO_REFERENCED_ROW_2") {
      return res
        .status(400)
        .json({ error: "La categoria seleccionada no existe" });
    }
    next(error);
  }
}

export async function cambiarStock(req, res, next) {
  try {
    const { stock } = req.body;

    if (
      stock === undefined ||
      Number(stock) < 0 ||
      Number.isNaN(Number(stock))
    ) {
      return res
        .status(400)
        .json({ error: "El stock debe ser un numero mayor o igual a 0" });
    }

    const actualizado = await productosModel.actualizarStock(
      req.params.id,
      Number(stock),
    );
    if (!actualizado) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    res.json({ mensaje: "Stock actualizado" });
  } catch (error) {
    next(error);
  }
}

export async function eliminar(req, res, next) {
  try {
    const eliminado = await productosModel.eliminarProducto(req.params.id);
    if (!eliminado) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }
    res.json({ mensaje: "Producto eliminado" });
  } catch (error) {
    next(error);
  }
}
