import { Router } from 'express';
import { getAllCategoriesController } from '../controllers/categories.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';

const router = Router();

router.get('/', ctrlWrapper(getAllCategoriesController));

export default router;
