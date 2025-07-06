// import { UserModel } from '../db/models/user.js';
import {
  login,
  logout,
  refreshUserSession,
  register,
  loginOrRegister,
} from '../services/auth.js';

import { getOAuthURL, validateCode } from '../utils/googleOAuth.js';

export const registerController = async (req, res, next) => {
  const user = await register(req.body);

  res.status(201).json({
    status: 201,
    message: 'Successfully registered a user!',
    data: user,
  });

  res.status(201).json({ message: 'User registered' });
};

export const loginController = async (req, res) => {
  const session = await login(req.body.email, req.body.password);

  //   console.log('Created session:', session);
  // const user = await UserModel.findById(session.userId);

  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expires: session.refreshTokenValidUntil,
  });

  res.cookie('sessionId', session._id, {
    httpOnly: true,
    expires: session.refreshTokenValidUntil,
    // expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
  });

  res.status(200).json({
    status: 200,
    message: 'Successfully logged in an user!',
    data: {
      // user,
      accessToken: session.accessToken,
    },
  });
};

export const logoutController = async (req, res) => {
  //   console.log(req.cookies);
  const { sessionId } = req.cookies;

  //   if (req.cookies.sessionId) {
  //     logoutUser(req.cookies.sessionId);
  //   }
  if (typeof sessionId === 'string') {
    await logout(sessionId);
  }

  res.clearCookie('sessionId');
  res.clearCookie('refreshToken');

  res.status(204).end();
};

export const refreshUserSessionController = async (req, res) => {
  const { sessionId, refreshToken } = req.cookies;

  const session = await refreshUserSession(sessionId, refreshToken);

  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expires: session.refreshTokenValidUntil,
  });

  res.cookie('sessionId', session._id, {
    httpOnly: true,
    expires: session.refreshTokenValidUntil,
  });

  res.json({
    status: 200,
    message: 'Successfully refreshed a session!',
    data: {
      accessToken: session.accessToken,
    },
  });
};

//GOOGLE AUTH

export function getOAuthController(req, res) {
  const url = getOAuthURL();

  res.json({
    status: 200,
    message: 'Successfully get OAuth url!',
    data: {
      oauth_url: url,
    },
  });
}

export async function confirmOAuthController(req, res) {
  const ticket = await validateCode(req.body.code);

  const session = await loginOrRegister(
    ticket.payload.email,
    ticket.payload.name,
  );

  res.cookie('sessionId', session._id, {
    httpOnly: true,
    expires: session.refreshTokenValidUntil,
  });

  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expires: session.refreshTokenValidUntil,
  });

  res.json({
    status: 200,
    message: 'Successfully login with Google!',
    data: {
      accessToken: session.accessToken,
    },
  });
}
