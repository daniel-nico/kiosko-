import { pool } from "../config/db.js";

export async function listarProductos() {
  const [filas] = await pool.query(`
    SELECT 
      p.id, 
      p.nombre, 
      p.precio, 
      p.stock, 
      p.stock_minimo, 
      p.categoria_id,
      c.nombre AS categoria,
      (p.stock <= p.stock_minimo) AS alerta_stock
    FROM productos p
    JOIN categorias c ON p.categoria_id = c.id
    ORDER BY p.id DESC
  `);

  return filas.map((prod) => ({
    ...prod,
    alerta_stock: !!prod.alerta_stock,
  }));
}

export async function crearProducto({
  nombre,
  precio,
  stock,
  stock_minimo,
  categoria_id,
}) {
  const [resultado] = await pool.query(
    "INSERT INTO productos (nombre, precio, stock, stock_minimo, categoria_id) VALUES (?, ?, ?, ?, ?)",
    [nombre, precio, stock, stock_minimo, categoria_id],
  );
  return {
    id: resultado.insertId,
    nombre,
    precio,
    stock,
    stock_minimo,
    categoria_id,
  };
}

export async function actualizarProducto(
  id,
  { nombre, precio, stock, stock_minimo, categoria_id },
) {
  const [resultado] = await pool.query(
    "UPDATE productos SET nombre = ?, precio = ?, stock = ?, stock_minimo = ?, categoria_id = ? WHERE id = ?",
    [nombre, precio, stock, stock_minimo, categoria_id, id],
  );
  return resultado.affectedRows > 0;
}

export async function actualizarStock(id, stock) {
  const [resultado] = await pool.query(
    "UPDATE productos SET stock = ? WHERE id = ?",
    [stock, id],
  );
  return resultado.affectedRows > 0;
}

export async function eliminarProducto(id) {
  const [resultado] = await pool.query("DELETE FROM productos WHERE id = ?", [
    id,
  ]);
  return resultado.affectedRows > 0;
}
