import { CategoryCollections } from '../db/models/categorie.js';

export const getAllCategories = async () => {
  return await CategoryCollections.find();
};
