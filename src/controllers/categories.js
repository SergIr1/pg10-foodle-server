import { getAllCategories } from '../services/categories.js';

export const getAllCategoriesController = async (req, res, next) => {
  const categories = await getAllCategories();

  res.status(200).json({
    status: 200,
    message: 'Categories fetched successfully',
    data: categories,
  });
};
