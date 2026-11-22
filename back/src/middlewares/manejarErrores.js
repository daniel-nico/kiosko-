export function manejarErrores(error, req, res, next) {
  console.error(error.message);
  const status = error.status || 500;
  res
    .status(status)
    .json({ error: error.message || "Error interno del servidor" });
}
