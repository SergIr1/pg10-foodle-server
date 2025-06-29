import Joi from 'joi';

export const recipeSchema = Joi.object({
  title: Joi.string().max(64).required(),
  description: Joi.string().max(200).required(),
  time: Joi.string().min(1).max(360).required(),
  // cals: Joi.number().min(1).max(10000).optional().allow(null, ''),
  area: Joi.string().max(64).optional().allow(''),
  // category: Joi.string().hex().length(24).required(),
  category: Joi.string().required(),
  instructions: Joi.string().max(1200).required(),
  ingredients: Joi.array()
    .items(
      Joi.object({
        id: Joi.string().hex().length(24).required(),
        measure: Joi.string().min(2).max(16).required(),
      }),
    )
    .min(1)
    .required(),
  // recipeImg: Joi.any(),
  thumb: Joi.any(),
});
