import createHttpError from 'http-errors';
import { getAllUsers, getUserById } from '../services/users.js';
import { UserModel } from '../db/models/user.js';

export const getAllUsersController = async (req, res, next) => {
  const users = await getAllUsers();

  res.status(200).json({
    status: 200,
    message: 'Successfully found users!',
    data: users,
  });
};

export const getUserByIdController = async (req, res, next) => {
  const { userId } = req.params;

  const user = await getUserById(userId);

  if (user === null) {
    throw createHttpError(404, 'User not found');
  }

  res.status(200).json({
    status: 200,
    message: `Successfully found user with id ${userId}!`,
    data: user,
  });
};

export const getCurrentUserController = async (req, res) => {
  const user = await UserModel.findById(req.user.id);

  res.status(200).json({
    status: 200,
    message: 'Current user retrieved successfully',
    data: user,
  });
};
