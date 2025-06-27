import { getPaginatedRecipes } from '../services/recipes.js';
import { parseFilterParams } from '../utils/parseFilterParams.js';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';

export const getPublicRecipesController = async (req, res) => {};
export const getRecipeByIdController = async (req, res) => {};
export const createOwnRecipeController = async (req, res) => {};
export const getOwnRecipesController = async (req, res) => {};
export const addToFavoritesController = async (req, res) => {};
export const removeFromFavoritesController = async (req, res) => {};
export const getFavoriteRecipesController = async (req, res) => {};
export const deleteOwnRecipeController = async (req, res) => {};
export const searchRecipesController = async (req, res, next) => {
  const pagination = parsePaginationParams(req.query);
  const sorting = parseSortParams(req.query);
  const filter = parseFilterParams(req.query);

  const result = await getPaginatedRecipes({
    ...pagination,
    ...sorting,
    filter,
  });

  res.status(200).json({
    status: 200,
    message: 'Successfully retrieved recipes!',
    data: result,
  });
};
