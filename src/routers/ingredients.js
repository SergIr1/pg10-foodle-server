import { Router } from 'express';
import { getAllIngredientsController } from '../controllers/ingredients.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';

const router = Router();

router.get('/', ctrlWrapper(getAllIngredientsController));

export default router;
