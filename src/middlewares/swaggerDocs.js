// import express from 'express';
// import fs from 'node:fs';
// import { SWAGGER_PATH } from '../constans/index.js';
// import createHttpError from 'http-errors';
// import swaggerUI from 'swagger-ui-express';
// export const swaggerDocs = () => {
//   const router = express.Router();
//   try {
//     const swaggerDoc = JSON.parse(fs.readFileSync(SWAGGER_PATH).toString());
//     router.use(swaggerUI.serve);
//     router.get('/', swaggerUI.setup(swaggerDoc));
//   } catch (err) {
//     router.use((req, res, next) =>
//       next(
//         createHttpError(500, "Can't load swagger docs", {
//           errors: err.details,
//         }),
//       ),
//     );
//   }
//   return router;
// };

import express from 'express';
import fs from 'node:fs';
import { SWAGGER_PATH } from '../constans/index.js';
import createHttpError from 'http-errors';
import swaggerUI from 'swagger-ui-express';

export const swaggerDocs = () => {
  const router = express.Router();

  try {
    const swaggerDoc = JSON.parse(fs.readFileSync(SWAGGER_PATH).toString());

    // Middleware для очистки sessionId cookie
    router.use((req, res, next) => {
      res.setHeader('Set-Cookie', 'sessionId=; Max-Age=0; Path=/; HttpOnly');
      next();
    });

    router.use(swaggerUI.serve);
    router.get(
      '/',
      swaggerUI.setup(swaggerDoc, {
        swaggerOptions: {
          persistAuthorization: false, // Вимикаю збереження авторизації
        },
      }),
    );
  } catch (err) {
    router.use((req, res, next) =>
      next(
        createHttpError(500, "Can't load swagger docs", {
          errors: err.details,
        }),
      ),
    );
  }

  return router;
};
