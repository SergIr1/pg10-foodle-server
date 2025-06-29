import { RecipeCollections } from '../db/models/recipe.js';
import { UserModel } from '../db/models/user.js';
import createHttpError from 'http-errors';


export const getPublicRecipes = async (filter, pagination) => {};
export const getRecipeById = async (recipeId) => {};
export const createRecipe = async (data, ownerId) => {};
export const getOwnRecipes = async (userId) => {};
export const addFavoriteRecipe = async (userId, recipeId) => {
  const user = await UserModel.findById(userId);
  if (!user) {
    throw new createHttpError.NotFound('User not found');
  }

  const isFavorite = user.favorites.some(
    favoriteId => favoriteId.toString() === recipeId.toString()
  );

  if (!isFavorite) {
    user.favorites.push(recipeId);
    await user.save();
  }

  return {
    added: !isFavorite,
  };
};
export const removeFavoriteRecipe = async (userId, recipeId) => {
  const user = await UserModel.findById(userId);
  if (!user) {
    throw new createHttpError.NotFound('User not found');
  }

  const initialLength = user.favorites.length;

  user.favorites = user.favorites.filter(
    favoriteId => favoriteId.toString() !== recipeId.toString()
  );

  if (user.favorites.length === initialLength) {
    throw new createHttpError.NotFound('Favorite recipe not found');
  }

  await user.save();
};
export const getFavoriteRecipes = async (userId) => {
 const user = await UserModel.findById(userId).populate('favorites');

  if (!user) {
    throw new createHttpError.NotFound('User not found');
  }

  return user.favorites;
};
export const deleteOwnRecipe = async (userId, recipeId) => {};
export const getPaginatedRecipes = async ({
  page,
  perPage,
  sortBy,
  sortOrder,
  filter,
}) => {
  const skip = (page - 1) * perPage;

  const recipeQuery = RecipeCollections.find(filter);

  const [totalItems, data] = await Promise.all([
    RecipeCollections.countDocuments(filter),
    recipeQuery
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(perPage),
  ]);

  const totalPages = Math.ceil(totalItems / perPage);

  return {
    data,
    page,
    perPage,
    totalItems,
    totalPages,
    hasNextPage: totalPages > page,
    hasPreviousPage: page > 1,
  };
};
