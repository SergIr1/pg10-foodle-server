import {
  getPaginatedRecipes,
  createRecipe,
  getOwnRecipes,
  getRecipeById,
} from '../services/recipes.js';
import { parseFilterParams } from '../utils/parseFilterParams.js';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import { UserModel } from '../db/models/user.js';
import createHttpError from 'http-errors';
import { saveFileToUploadDir } from '../utils/saveFileToUploadDir.js';
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';
import { getEnvVar } from '../utils/getEnvVar.js';

export const getRecipeByIdController = async (req, res, next) => {
  try {
    const { recipeId } = req.params;
    const recipe = await getRecipeById(recipeId);

    res.status(200).json({
      status: 200,
      message: 'Recipe retrieved successfully',
      data: recipe,
    });
  } catch (error) {
    next(error);
  }
};

export const createOwnRecipeController = async (req, res, next) => {
  try {
    const photo = req.file;
    let photoUrl;

    if (photo) {
      if (getEnvVar('ENABLE_CLOUDINARY') === 'true') {
        photoUrl = await saveFileToCloudinary(photo);
      } else {
        photoUrl = await saveFileToUploadDir(photo);
      }
    }
    const recipe = await createRecipe({
      ...req.body,
      photo: photoUrl,
      owner: req.user.id,
    });
    res.status(201).json({
      status: 201,
      message: 'Recipe created successfully',
      data: recipe,
    });
  } catch (err) {
    next(err);
  }
};
export const getOwnRecipesController = async (req, res) => {
  const { page, perPage } = parsePaginationParams(req.query);

  const result = await getOwnRecipes(req.user.id, page, perPage);

  if (result.data.length === 0) {
    throw new createHttpError.NotFound('You have no recipes');
  }

  res.status(200).json({
    status: 200,
    message: 'Successfully retrieved own recipes!',
    data: result,
  });
};
export const addToFavoritesController = async (req, res, next) => {
  try {
    const { recipeId } = req.params;
    // console.log('AUTH:', req.user);
    // console.log(req.user._id);
    const user = await UserModel.findById(req.user.id);
    // console.log(user);
    if (!user) {
      throw new createHttpError.NotFound('User not found');
    }

    const alreadyInFavorites = user.favorites.some(
      (favoriteId) => favoriteId.toString() === recipeId,
    );

    if (!alreadyInFavorites) {
      user.favorites.push(recipeId);
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
  }
};

export const removeFromFavoritesController = async (req, res) => {
  const { recipeId } = req.params;

  const user = await UserModel.findById(req.user.id);

  if (!user) {
    throw new createHttpError.NotFound('User not found');
  }

  const originalLength = user.favorites.length;

  user.favorites = user.favorites.filter(
    (favoriteId) => favoriteId.toString() !== recipeId.toString(),
  );

  if (user.favorites.length === originalLength) {
    throw new createHttpError.NotFound('Favorite recipe not found');
  }

  await user.save();

  res.status(204).end();
};

export const getFavoriteRecipesController = async (req, res, next) => {
  try {
    const user = await UserModel.findById(req.user.id).populate('favorites');

    if (!user) {
      throw new createHttpError.NotFound('User not found');
    }

    res.status(200).json({
      status: 200,
      message: 'Favorites retrieved successfully',
      data: user.favorites,
    });
  } catch (error) {
    next(error);
  }
};

import { deleteOwnRecipe } from '../services/recipes.js';

export const deleteOwnRecipeController = async (req, res, next) => {
  const { recipeId } = req.params;

  await deleteOwnRecipe(req.user.id, recipeId);

  res.status(204).end();
};

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
