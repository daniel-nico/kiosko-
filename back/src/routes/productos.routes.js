import { Router } from "express";
import { requiereAutenticacion } from "../middlewares/requiereAutenticacion.js";
import { soloAdmin } from "../middlewares/soloAdmin.js";
import * as controlador from "../controllers/productos.controller.js";

const router = Router();

router.use(requiereAutenticacion);

router.get("/", controlador.listar);
router.patch("/:id/stock", controlador.cambiarStock);

router.post("/", soloAdmin, controlador.crear);
router.put("/:id", soloAdmin, controlador.actualizar);
router.delete("/:id", soloAdmin, controlador.eliminar);

export default router;
