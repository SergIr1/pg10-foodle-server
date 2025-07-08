import bcrypt from 'bcrypt';
import crypto, { randomBytes } from 'node:crypto';
import createHttpError from 'http-errors';
import { SessionCollection } from '../db/models/sessions.js';
import { UserModel } from '../db/models/user.js';

export const register = async (payload) => {
  const user = await UserModel.findOne({ email: payload.email });

  if (user !== null) {
    throw createHttpError(409, 'Email in use');
  }

  const encryptedPassword = await bcrypt.hash(payload.password, 10);

  return await UserModel.create({
    ...payload,
    password: encryptedPassword,
  });
};
export const login = async (email, password) => {
  const user = await UserModel.findOne({ email });

  if (user === null) {
    throw createHttpError(401, 'Email or password is incorrect');
  }

  const isEqual = await bcrypt.compare(password, user.password);

  if (!isEqual) {
    throw createHttpError(401, 'Email or password is incorrect');
  }

  const accessToken = crypto.randomBytes(30).toString('base64');
  const refreshToken = crypto.randomBytes(30).toString('base64');

  const session = await SessionCollection.create({
    userId: user._id,
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + 30 * 60 * 1000), // 15 * 60 * 1000
    refreshTokenValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  });

  return session;
};

export const logout = async (sessionId) => {
  await SessionCollection.deleteOne({ _id: sessionId });
};

const createSession = () => {
  const accessToken = randomBytes(30).toString('base64');
  const refreshToken = randomBytes(30).toString('base64');

  return {
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + 30 * 60 * 1000), // 15 * 60 * 1000
    refreshTokenValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  };
};

export const refreshUserSession = async (sessionId, refreshToken) => {
  const session = await SessionCollection.findOne({ _id: sessionId });

  // if (session === null) {
  //   throw createHttpError(401, 'Session not found');
  // }

  // if (session.refreshToken !== refreshToken) {
  //   throw createHttpError(401, 'Refresh token is invalid');
  // }
  if (!session || session.refreshToken !== refreshToken) {
    throw createHttpError(401, 'Refresh token or session is invalid');
  } // добавил

  if (session.refreshTokenValidUntil < Date.now()) {
    throw createHttpError(401, 'Refresh token is expired');
  }

  const newSession = createSession();

  await SessionCollection.deleteOne({ _id: sessionId, refreshToken });
  // await SessionCollection.deleteOne({ _id: sessionId });

  return await SessionCollection.create({
    userId: session.userId,
    ...newSession,
  });
};

//GOOGLE AUTH

export async function loginOrRegister(email, name) {
  let user = await UserModel.findOne({ email });

  if (user === null) {
    const password = await bcrypt.hash(
      crypto.randomBytes(30).toString('base64'),
      10,
    );

    user = await UserModel.create({ name, email, password });
  }

  const accessToken = crypto.randomBytes(30).toString('base64');
  const refreshToken = crypto.randomBytes(30).toString('base64');

  // await SessionCollection.deleteOne({ userId: user._id, refreshToken });
  await SessionCollection.deleteMany({ userId: user._id });

  const session = await SessionCollection.create({
    userId: user._id,
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + 30 * 60 * 1000),
    refreshTokenValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  });

  return session;
}
