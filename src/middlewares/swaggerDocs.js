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

    router.use((req, res, next) => {
      const originalEnd = res.end;
      res.end = function (...args) {
        res.setHeader(
          'Set-Cookie',
          'sessionId=; Max-Age=0; Path=/; HttpOnly; SameSite=Lax',
        );
        return originalEnd.apply(this, args);
      };
      next();
    });

    router.use(swaggerUI.serve);
    router.get(
      '/',
      swaggerUI.setup(swaggerDoc, {
        swaggerOptions: {
          persistAuthorization: false,
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
