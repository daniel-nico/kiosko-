import { request } from "./api";

export const listar = (signal) => request("/categorias", { signal });
export const crear = (nombre) =>
  request("/categorias", { metodo: "POST", cuerpo: { nombre } });
export const actualizar = (id, nombre) =>
  request(`/categorias/${id}`, { metodo: "PUT", cuerpo: { nombre } });
export const eliminar = (id) =>
  request(`/categorias/${id}`, { metodo: "DELETE" });
