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

const router = Router();

router.get('/search', ctrlWrapper(searchRecipesController));

router.get('/:recipeId', isValidId, ctrlWrapper(getRecipeByIdController));

router.post(
  '/',
  validateBody(recipeSchema),
  ctrlWrapper(createOwnRecipeController),
);

router.get('/own', ctrlWrapper(getOwnRecipesController));

router.post(
  '/:recipeId/favorite',
  isValidId,
  ctrlWrapper(addToFavoritesController),
);

router.delete(
  '/:recipeId/favorite',
  isValidId,
  ctrlWrapper(removeFromFavoritesController),
);

router.get('/favorite', ctrlWrapper(getFavoriteRecipesController));

router.delete('/:recipeId', isValidId, ctrlWrapper(deleteOwnRecipeController));

export default router;
