import "dotenv/config";
import bcrypt from "bcrypt";
import { pool } from "../src/config/db.js";

const hash = await bcrypt.hash("1234", 10);

await pool.query(
  `INSERT IGNORE INTO usuarios (nombre, password, rol) VALUES 
   ('admin', ?, 'admin'),
   ('empleado', ?, 'usuario')`,
  [hash, hash],
);

console.log("Usuarios admin y empleado creados (clave: 1234)");
process.exit();
