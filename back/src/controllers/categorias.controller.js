import * as categoriasModel from "../models/categorias.model.js";

export async function listar(req, res, next) {
  try {
    const categorias = await categoriasModel.listarCategorias();
    res.json(categorias);
  } catch (error) {
    next(error);
  }
}

export async function crear(req, res, next) {
  try {
    const { nombre } = req.body;
    if (!nombre || !nombre.trim()) {
      return res
        .status(400)
        .json({ error: "El nombre de la categoria es obligatorio" });
    }
    const nueva = await categoriasModel.crearCategoria(nombre.trim());
    res.status(201).json(nueva);
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(400).json({ error: "Esa categoria ya existe" });
    }
    next(error);
  }
}

export async function actualizar(req, res, next) {
  try {
    const { nombre } = req.body;
    if (!nombre || !nombre.trim()) {
      return res
        .status(400)
        .json({ error: "El nombre de la categoria es obligatorio" });
    }
    const editada = await categoriasModel.actualizarCategoria(
      req.params.id,
      nombre.trim(),
    );
    if (!editada) {
      return res.status(404).json({ error: "Categoria no encontrada" });
    }
    res.json({ id: Number(req.params.id), nombre: nombre.trim() });
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(400).json({ error: "Esa categoria ya existe" });
    }
    next(error);
  }
}

export async function eliminar(req, res, next) {
  try {
    const eliminada = await categoriasModel.eliminarCategoria(req.params.id);
    if (!eliminada) {
      return res.status(404).json({ error: "Categoria no encontrada" });
    }
    res.json({ mensaje: "Categoria eliminada" });
  } catch (error) {
    if (error.code === "ER_ROW_IS_REFERENCED_2") {
      return res
        .status(400)
        .json({ error: "No se puede borrar: tiene productos asociados" });
    }
    next(error);
  }
}
