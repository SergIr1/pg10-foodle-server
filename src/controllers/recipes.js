import { getPaginatedRecipes } from '../services/recipes.js';
import { parseFilterParams } from '../utils/parseFilterParams.js';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import  {UserModel}  from '../db/models/user.js';
import createHttpError from 'http-errors';

export const getPublicRecipesController = async (req, res) => {};
export const getRecipeByIdController = async (req, res) => {};
export const createOwnRecipeController = async (req, res) => {};
export const getOwnRecipesController = async (req, res) => {};
export const addToFavoritesController = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await UserModel.findById(req.user._id);

    if (!user) {
      throw new createHttpError.NotFound('User not found');
    }

    const alreadyInFavorites = user.favorites.some(
      favoriteId => favoriteId.toString() === id
    );

    if (!alreadyInFavorites) {
      user.favorites.push(id);
      await user.save();
    }

    res.status(200).json({
      status: 200,
      message: alreadyInFavorites
        ? 'Recipe already in favorites'
        : 'Recipe added to favorites',
    });
  } catch (error) {
    console.error('Add to favorites error:', error);
    next(error);
  };
};

export const removeFromFavoritesController = async (req, res) => {
  const { id } = req.params;

  const user = await UserModel.findById(req.user._id);

  if (!user) {
    throw new createHttpError.NotFound('User not found');
  }

  const originalLength = user.favorites.length;

  user.favorites = user.favorites.filter(
    favoriteId => favoriteId.toString() !== id.toString()
  );

  if (user.favorites.length === originalLength) {
    throw new createHttpError.NotFound('Favorite recipe not found');
  }

  await user.save();

  res.status(204).end(); 
};

export const getFavoriteRecipesController = async (req, res) => {
  const user = await UserModel.findById(req.user._id).populate('favorites');

  if (!user) {
    throw new createHttpError.NotFound('User not found');
  }

  res.status(200).json({
    status: 200,
    message: 'Favorites retrieved successfully',
    data: user.favorites,
  });
};

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
