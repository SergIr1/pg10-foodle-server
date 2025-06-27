import { UserModel } from '../db/models/user.js';

export const getAllUsers = async () => {
  const users = await UserModel.find();
  return users;
};

export const getUserById = async (userId) => {
  const user = await UserModel.findById(userId);
  return user;
};
