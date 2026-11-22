import { createContext, useContext, useState } from "react";
import * as authService from "../services/auth";
import { guardarToken, borrarToken } from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(() => {
    const guardado = localStorage.getItem("usuario");
    return guardado ? JSON.parse(guardado) : null;
  });

  function abrirSesion({ token, usuario: datos }) {
    guardarToken(token);
    localStorage.setItem("usuario", JSON.stringify(datos));
    setUsuario(datos);
  }

  async function login(nombre, password) {
    const respuesta = await authService.login(nombre, password);
    abrirSesion(respuesta);
  }

  async function registro(nombre, password) {
    await authService.registro(nombre, password);
    await login(nombre, password);
  }

  function logout() {
    borrarToken();
    localStorage.removeItem("usuario");
    setUsuario(null);
  }

  return (
    <AuthContext.Provider value={{ usuario, login, registro, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const contexto = useContext(AuthContext);
  if (!contexto)
    throw new Error("useAuth debe usarse dentro de <AuthProvider>");
  return contexto;
}
