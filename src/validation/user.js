import Joi from 'joi';

export const getUserByIdSchema = Joi.object({
  userId: Joi.string().hex().length(24).required(),
});
