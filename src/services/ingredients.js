import IngredientCollection from '../db/models/Ingredient.js';

export const getIngredients = async () => {
  const ingredients = await IngredientCollection.find();
  return ingredients;
};
