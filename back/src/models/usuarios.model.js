import { pool } from "../config/db.js";

export async function buscarPorNombre(nombre) {
  const [filas] = await pool.query(
    "SELECT id, nombre, password, rol FROM usuarios WHERE nombre = ?",
    [nombre],
  );
  return filas[0];
}

export async function crearUsuario(nombre, passwordHash) {
  const [resultado] = await pool.query(
    "INSERT INTO usuarios (nombre, password) VALUES (?, ?)",
    [nombre, passwordHash],
  );
  return { id: resultado.insertId, nombre, rol: "usuario" };
}
