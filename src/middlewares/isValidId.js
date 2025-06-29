import createHttpError from 'http-errors';
import { isValidObjectId } from 'mongoose';

// export const isValidId = (req, res, next) => {
//   //   console.log(req.params.id);
//   const { userId } = req.params;
//   if (!isValidObjectId(userId)) {
//     throw createHttpError(400, 'Bad Request');
//   }

//   next();
// };

// import createHttpError from 'http-errors';
// import { isValidObjectId } from 'mongoose';

export const isValidId = (req, res, next) => {
  const [key] = Object.keys(req.params);
  const id = req.params[key];

  if (!isValidObjectId(id)) {
    throw createHttpError(400, `Invalid ID in param: ${key}`);
  }

  next();
};
