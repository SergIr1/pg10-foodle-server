import { Schema, model } from 'mongoose';

const ingredientSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    desc: {
      type: String,
      trim: true,
    },
    img: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

const IngredientCollection = model('Ingredient', ingredientSchema);
export default IngredientCollection;
