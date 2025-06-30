import { RecipeCollections } from '../db/models/recipe.js';
import { UserModel } from '../db/models/user.js';
import createHttpError from 'http-errors';

export const getRecipeById = async (recipeId) => {
  const recipe = await RecipeCollections.findById(recipeId)
    .populate('ingredients.id', '-__v')
    .populate('owner', 'name email avatar');

  if (!recipe) {
    throw new createHttpError.NotFound('Recipe not found');
  }

  return recipe;
};

export const createRecipe = async (payload) => {
  return await RecipeCollections.create(payload);
};

export const getOwnRecipes = async (userId, page = 1, perPage = 12) => {
  const skip = (page - 1) * perPage;

  const query = { owner: userId };

  const [totalItems, data] = await Promise.all([
    RecipeCollections.countDocuments(query),
    RecipeCollections.find(query)
      .sort({ createdAt: -1 })
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
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1,
  };
};

export const addFavoriteRecipe = async (userId, recipeId) => {
  const user = await UserModel.findById(userId);
  if (!user) {
    throw new createHttpError.NotFound('User not found');
  }

  const isFavorite = user.favorites.some(
    (favoriteId) => favoriteId.toString() === recipeId.toString(),
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
    (favoriteId) => favoriteId.toString() !== recipeId.toString(),
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
export const deleteOwnRecipe = async (userId, recipeId) => {
  const recipe = await RecipeCollections.findById(recipeId);

  if (!recipe) {
    throw new createHttpError.NotFound('Recipe not found');
  }

  if (recipe.owner.toString() !== userId.toString()) {
    throw new createHttpError.Forbidden('You can delete only your own recipe');
  }

  await RecipeCollections.findByIdAndDelete(recipeId);

  await UserModel.updateMany(
    { favorites: recipeId },
    { $pull: { favorites: recipeId } },
  );

  return;
};
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
