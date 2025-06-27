import Joi from 'joi';

export const ingredientSchema = Joi.object({
  name: Joi.string().required(),
  desc: Joi.string().required(),
  img: Joi.string().uri().required(),
});
