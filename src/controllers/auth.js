import { UserModel } from '../db/models/user.js';
import {
  login,
  logout,
  refreshUserSession,
  register,
  loginOrRegister,
} from '../services/auth.js';

import { getOAuthURL, validateCode } from '../utils/googleOAuth.js';

const getCookieOptions = (expires) => ({
  httpOnly: true,
  // sameSite: 'None',
  sameSite: 'Lax',
  // secure: true, тимчасово вимкнув щоб http локалхосту потестити
  expires,
});

export const registerController = async (req, res, next) => {
  const user = await register(req.body);

  const session = await login(req.body.email, req.body.password);

  // res.cookie('refreshToken', session.refreshToken, {
  //   httpOnly: true,
  //   expires: session.refreshTokenValidUntil,
  // });

  // res.cookie('sessionId', session._id, {
  //   httpOnly: true,
  //   expires: session.refreshTokenValidUntil,
  // });

  res.cookie(
    'refreshToken',
    session.refreshToken,
    getCookieOptions(session.refreshTokenValidUntil),
  );
  res.cookie(
    'sessionId',
    session._id,
    getCookieOptions(session.refreshTokenValidUntil),
  );

  res.status(201).json({
    status: 201,
    message: 'Successfully registered and logged in!',
    data: {
      user,
      accessToken: session.accessToken,
    },
  });
};

export const loginController = async (req, res) => {
  const session = await login(req.body.email, req.body.password);

  console.log('Created session:', session);
  const user = await UserModel.findById(session.userId);

  // res.cookie('refreshToken', session.refreshToken, {
  //   httpOnly: true,
  //   expires: session.refreshTokenValidUntil,
  // });

  // res.cookie('sessionId', session._id, {
  //   httpOnly: true,
  //   expires: session.refreshTokenValidUntil,
  //   // expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
  // });

  res.cookie(
    'refreshToken',
    session.refreshToken,
    getCookieOptions(session.refreshTokenValidUntil),
  );
  res.cookie(
    'sessionId',
    session._id,
    getCookieOptions(session.refreshTokenValidUntil),
  );

  res.status(200).json({
    status: 200,
    message: 'Successfully logged in an user!',
    data: {
      user,
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

  // res.clearCookie('sessionId');
  // res.clearCookie('refreshToken');

  res.clearCookie('sessionId', { sameSite: 'None', secure: true });
  res.clearCookie('refreshToken', { sameSite: 'None', secure: true });

  res.status(204).end();
};

export const refreshUserSessionController = async (req, res) => {
  const { sessionId, refreshToken } = req.cookies;

  console.log('Cookies:', req.cookies);
  console.log('sessionId:', req.cookies.sessionId);
  console.log('refreshToken:', req.cookies.refreshToken);

  const session = await refreshUserSession(sessionId, refreshToken);

  // res.cookie('refreshToken', session.refreshToken, {
  //   httpOnly: true,
  //   expires: session.refreshTokenValidUntil,
  // });

  // res.cookie('sessionId', session._id, {
  //   httpOnly: true,
  //   expires: session.refreshTokenValidUntil,
  // });

  res.cookie(
    'refreshToken',
    session.refreshToken,
    getCookieOptions(session.refreshTokenValidUntil),
  );
  res.cookie(
    'sessionId',
    session._id,
    getCookieOptions(session.refreshTokenValidUntil),
  );

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

  // res.cookie('sessionId', session._id, {
  //   httpOnly: true,
  //   expires: session.refreshTokenValidUntil,
  // });

  // res.cookie('refreshToken', session.refreshToken, {
  //   httpOnly: true,
  //   expires: session.refreshTokenValidUntil,
  // });

  res.cookie(
    'sessionId',
    session._id,
    getCookieOptions(session.refreshTokenValidUntil),
  );
  res.cookie(
    'refreshToken',
    session.refreshToken,
    getCookieOptions(session.refreshTokenValidUntil),
  );

  res.json({
    status: 200,
    message: 'Successfully login with Google!',
    data: {
      accessToken: session.accessToken,
    },
  });
}
