import { request } from "./api";

export const listar = (signal) => request("/productos", { signal });
export const crear = (datos) =>
  request("/productos", { metodo: "POST", cuerpo: datos });
export const actualizar = (id, datos) =>
  request(`/productos/${id}`, { metodo: "PUT", cuerpo: datos });
export const cambiarStock = (id, stock) =>
  request(`/productos/${id}/stock`, { metodo: "PATCH", cuerpo: { stock } });
export const eliminar = (id) =>
  request(`/productos/${id}`, { metodo: "DELETE" });
