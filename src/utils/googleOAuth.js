// import { OAuth2Client } from 'google-auth-library';
// import { getEnvVar } from './getEnvVar.js';

// const googleOAuthClient = new OAuth2Client({
//   client_id: getEnvVar('GOOGLE_AUTH_CLIENT_ID'),
//   clientSecret: getEnvVar('GOOGLE_AUTH_CLIENT_SECRET'),
//   redirectUri: getEnvVar('GOOGLE_AUTH_REDIRECT_URI'),
// });

// export function getOAuthURL() {
//   return googleOAuthClient.generateAuthUrl({
//     scope: [
//       'https://www.googleapis.com/auth/userinfo.email',
//       'https://www.googleapis.com/auth/userinfo.profile',
//     ],
//   });
// }

// export async function validateCode(code) {
//   const response = await googleOAuthClient.getToken(code);

//   const ticket = await googleOAuthClient.verifyIdToken({
//     idToken: response.tokens.id_token,
//   });

//   return ticket;
// }

import { OAuth2Client } from 'google-auth-library';
import { getEnvVar } from './getEnvVar.js';

const googleOAuthClient = new OAuth2Client({
  client_id: getEnvVar('GOOGLE_AUTH_CLIENT_ID'),
  clientSecret: getEnvVar('GOOGLE_AUTH_CLIENT_SECRET'),
  redirectUri: getEnvVar('GOOGLE_AUTH_REDIRECT_URI'),
});
console.log('GOOGLE_AUTH_CLIENT_ID:', getEnvVar('GOOGLE_AUTH_CLIENT_ID'));

export function getOAuthURL() {
  // return googleOAuthClient.generateAuthUrl({
  //   scope: [
  //     'https://www.googleapis.com/auth/userinfo.email',
  //     'https://www.googleapis.com/auth/userinfo.profile',
  //   ],
  // });
  return googleOAuthClient.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent',
    scope: [
      'openid',
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/userinfo.profile',
    ],
  });
}

export async function validateCode(code) {
  // const response = await googleOAuthClient.getToken(code);

  // const ticket = await googleOAuthClient.verifyIdToken({
  //   idToken: response.tokens.id_token,
  // });
  const { tokens } = await googleOAuthClient.getToken(code);
  console.log('ID Token from Google:', tokens.id_token);
  if (!tokens.id_token) {
    throw new Error('No id_token returned from Google');
  }

  const ticket = await googleOAuthClient.verifyIdToken({
    idToken: tokens.id_token,
    audience: getEnvVar('GOOGLE_AUTH_CLIENT_ID'),
  });

  console.log('Google ticket payload:', ticket.getPayload());

  return ticket;
}
