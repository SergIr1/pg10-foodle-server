export const parseIngredients = (req, res, next) => {
  if (typeof req.body.ingredients === 'string') {
    try {
      req.body.ingredients = JSON.parse(req.body.ingredients);
    } catch (error) {
      return res.status(400).json({
        status: 400,
        message: ['Invalid JSON format for ingredients'],
      });
    }
  }
  next();
};
