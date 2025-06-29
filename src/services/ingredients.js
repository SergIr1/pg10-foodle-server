import IngredientCollection from '../db/models/ingredient.js';

export const getIngredients = async () => {
  const ingredients = await IngredientCollection.find();
  return ingredients;
};
