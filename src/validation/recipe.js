import Joi from 'joi';

export const recipeSchema = Joi.object({
  name: Joi.string().max(64).required(),
  decr: Joi.string().max(200).required(),
  cookiesTime: Joi.number().min(1).max(360).required(),
  cals: Joi.number().min(1).max(10000).optional().allow(null, ''),
  category: Joi.string().hex().length(24).required(),
  ingredients: Joi.array()
    .items(
      Joi.object({
        ingredient: Joi.string().hex().length(24).required(),
        ingredientAmount: Joi.string().min(2).max(16).required(),
      }),
    )
    .min(1)
    .required(),
  instruction: Joi.string().max(1200).required(),
  recipeImg: Joi.any(),
});
