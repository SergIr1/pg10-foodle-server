import { RecipeCollections } from '../db/models/recipe.js';

export const getPublicRecipes = async (filter, pagination) => {};
export const getRecipeById = async (recipeId) => {};
export const createRecipe = async (data, ownerId) => {};
export const getOwnRecipes = async (userId) => {};
export const addFavoriteRecipe = async (userId, recipeId) => {};
export const removeFavoriteRecipe = async (userId, recipeId) => {};
export const getFavoriteRecipes = async (userId) => {};
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
