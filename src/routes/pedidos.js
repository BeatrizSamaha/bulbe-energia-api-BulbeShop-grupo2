import { Router } from "express";
import { buscarPedidoPorId } from "../controllers/pedidosController.js";
import { autenticar } from "../middlewares/autenticar.js";

const router = Router();

router.get('/:id', autenticar,buscarPedidoPorId);

export default router;