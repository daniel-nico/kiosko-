import { request } from "./api";

export const login = (nombre, password) =>
  request("/auth/login", { metodo: "POST", cuerpo: { nombre, password } });

export const registro = (nombre, password) =>
  request("/auth/registro", { metodo: "POST", cuerpo: { nombre, password } });
