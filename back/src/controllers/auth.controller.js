import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import * as usuariosModel from "../models/usuarios.model.js";

export async function registrar(req, res, next) {
  try {
    const { nombre, password } = req.body;

    if (!nombre || !password) {
      return res.status(400).json({ error: "Faltan nombre o password" });
    }

    const hash = await bcrypt.hash(password, 10);
    const nuevoUsuario = await usuariosModel.crearUsuario(nombre.trim(), hash);

    res.status(201).json(nuevoUsuario);
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(400).json({ error: "Ese nombre de usuario ya existe" });
    }
    next(error);
  }
}

export async function login(req, res, next) {
  try {
    const { nombre, password } = req.body;

    if (!nombre || !password) {
      return res.status(400).json({ error: "Faltan nombre o password" });
    }

    const usuario = await usuariosModel.buscarPorNombre(nombre);
    if (!usuario) {
      return res.status(401).json({ error: "Usuario o password incorrectos" });
    }

    const esValida = await bcrypt.compare(password, usuario.password);
    if (!esValida) {
      return res.status(401).json({ error: "Usuario o password incorrectos" });
    }

    const payload = {
      id: usuario.id,
      nombre: usuario.nombre,
      rol: usuario.rol,
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "4h",
    });

    res.json({ token, usuario: payload });
  } catch (error) {
    next(error);
  }
}
