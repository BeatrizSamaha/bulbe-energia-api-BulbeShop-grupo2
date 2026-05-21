import { Router } from 'express';
import {
    dashboardAdmin, listarUsuarios,
    buscarUsuarioPorId, alterarPapelUsuario, deletarUsuario,
    listarTodosPedidos,
} from '../controllers/adminController.js';
import { autenticar } from '../middlewares/autenticar.js';
import { autorizar }  from '../middlewares/autorizar.js';

const router = Router();

// Todas as rotas exigem autenticação + papel admin
router.use(autenticar, autorizar('admin'));

router.get('/dashboard',            dashboardAdmin);
router.get('/pedidos',              listarTodosPedidos);
router.get('/usuarios',             listarUsuarios);
router.get('/usuarios/:id',         buscarUsuarioPorId);
router.patch('/usuarios/:id/papel', alterarPapelUsuario);
router.delete('/usuarios/:id',      deletarUsuario);

export default router;