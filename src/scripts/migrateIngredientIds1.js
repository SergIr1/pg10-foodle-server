import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { RecipeCollections } from '../db/models/recipe.js';

dotenv.config();

const runMigration = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');

  const recipes = await RecipeCollections.find();

  for (const recipe of recipes) {
    const updatedIngredients = recipe.ingredients.map((ing, index) => {
      const fixedMeasure =
        !ing.measure || ing.measure.trim() === '' ? 'to taste' : ing.measure;

      if (!ing.measure || ing.measure.trim() === '') {
        console.warn(
          `Added fallback 'measure' in recipe ${recipe._id}, ingredient index ${index}`,
        );
      }

      return {
        ...ing,
        id: new mongoose.Types.ObjectId(ing.id),
        measure: fixedMeasure,
      };
    });

    recipe.ingredients = updatedIngredients;

    try {
      await RecipeCollections.updateOne(
        { _id: recipe._id },
        { $set: { ingredients: updatedIngredients } },
      );
      //   console.log(`Recipe ${recipe._id} migrated successfully.`);
    } catch (err) {
      console.error(`Failed to save recipe ${recipe._id}:`, err.message);
    }
  }

  console.log('Migration complete!');
  await mongoose.disconnect();
};

runMigration().catch((err) => console.error(err));
