import { Router } from 'express';
import {
    avaliarProduto,
    listarAvaliacoesDoProduto,
} from '../controllers/avaliacoesController.js';
import { autenticar } from '../middlewares/autenticar.js';
import { validar }    from '../middlewares/validar.js';
import { schemaAvaliacao } from '../validators/schemas.js';

const router = Router({ mergeParams: true });

router.get('/',  listarAvaliacoesDoProduto);
router.post('/', autenticar, validar(schemaAvaliacao), avaliarProduto);

export default router;

//fazer swegger