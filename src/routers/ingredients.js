import { Router } from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { getIngredientsController } from '../controllers/ingredients.js';

const router = Router();

// GET /api/ingredients - публічний ендпоінт для отримання всіх інгредієнтів
router.get('/', ctrlWrapper(getIngredientsController));

export default router;
