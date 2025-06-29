import { model, Schema } from 'mongoose';

const recipeSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    category: {
      type: String, // ===себе пометка, может ref++++++++===
      required: true,
    },
    area: {
      type: String,
      required: false,
    },
    instructions: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: false,
    },
    thumb: {
      type: String,
      required: false,
    },
    time: {
      type: String, // ===себе пометка, можем number как варик++++++++===
      required: false,
    },
    ingredients: [
      {
        id: {
          type: Schema.Types.ObjectId,
          ref: 'Ingredient',
          required: true,
        },
        measure: {
          type: String,
          required: true,
        },
      },
    ],
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    photo: { type: String },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const RecipeCollections = model('Recipe', recipeSchema);
