import mongoose from 'mongoose';

export const parseFilterParams = (query) => {
  const { category, ingredient, title } = query;
  const filter = {};

  if (category) {
    filter.category = category;
  }

  // if (ingredient) {
  //   // filter['ingredients.id'] = ingredient;
  //   // filter.ingredients = { $elemMatch: { id: ingredient } };
  //   filter.ingredients = {
  //     $elemMatch: {
  //       id: new mongoose.Types.ObjectId(ingredient),
  //     },
  //   };
  // }
  if (ingredient && mongoose.Types.ObjectId.isValid(ingredient)) {
    filter.ingredients = {
      $elemMatch: {
        id: new mongoose.Types.ObjectId(ingredient),
      },
    };
  }

  if (title) {
    filter.title = { $regex: title, $options: 'i' };
  }

  return filter;
};
