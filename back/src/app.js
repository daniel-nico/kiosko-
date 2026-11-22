import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import categoriasRoutes from "./routes/categorias.routes.js";
import productosRoutes from "./routes/productos.routes.js";
import { manejarErrores } from "./middlewares/manejarErrores.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/categorias", categoriasRoutes);
app.use("/api/productos", productosRoutes);

// Ruta 404 para URLs que no existen
app.use((req, res) => {
  res.status(404).json({ error: `No existe la ruta ${req.method} ${req.url}` });
});

// Middleware de errores (siempre al final)
app.use(manejarErrores);

export default app;
