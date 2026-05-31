import { Router } from 'express';
import { calcularFrete } from '../controllers/freteController.js';

const router = Router();

router.get('/', calcularFrete);

export default router;