import { pool } from "../config/db.js";

export async function listarCategorias() {
  const [filas] = await pool.query(
    "SELECT id, nombre FROM categorias ORDER BY nombre ASC",
  );
  return filas;
}

export async function crearCategoria(nombre) {
  const [resultado] = await pool.query(
    "INSERT INTO categorias (nombre) VALUES (?)",
    [nombre],
  );
  return { id: resultado.insertId, nombre };
}

export async function actualizarCategoria(id, nombre) {
  const [resultado] = await pool.query(
    "UPDATE categorias SET nombre = ? WHERE id = ?",
    [nombre, id],
  );
  return resultado.affectedRows > 0;
}

export async function eliminarCategoria(id) {
  const [resultado] = await pool.query("DELETE FROM categorias WHERE id = ?", [
    id,
  ]);
  return resultado.affectedRows > 0;
}
