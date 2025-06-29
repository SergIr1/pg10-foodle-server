import { Router } from 'express';
import {
  searchRecipesController,
  getRecipeByIdController,
  createOwnRecipeController,
  getOwnRecipesController,
  addToFavoritesController,
  removeFromFavoritesController,
  getFavoriteRecipesController,
  deleteOwnRecipeController,
} from '../controllers/recipes.js';

import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { isValidId } from '../middlewares/isValidId.js';
import { validateBody } from '../middlewares/validateBody.js';
import { recipeSchema } from '../validation/recipe.js';
import { authenticate } from '../middlewares/authenticate.js';

const router = Router();

router.get('/search', ctrlWrapper(searchRecipesController));

router.get(
  '/favorite',
  authenticate,
  ctrlWrapper(getFavoriteRecipesController),
);

router.get('/:recipeId', isValidId, ctrlWrapper(getRecipeByIdController));

router.post(
  '/',
  authenticate,
  validateBody(recipeSchema),
  ctrlWrapper(createOwnRecipeController),
);

router.get('/own', authenticate, ctrlWrapper(getOwnRecipesController));

router.post(
  '/:recipeId/favorite',
  authenticate,
  isValidId,
  ctrlWrapper(addToFavoritesController),
);

router.delete(
  '/:recipeId/favorite',
  authenticate,
  isValidId,
  ctrlWrapper(removeFromFavoritesController),
);

router.delete(
  '/:recipeId',
  authenticate,
  isValidId,
  ctrlWrapper(deleteOwnRecipeController),
);

export default router;
