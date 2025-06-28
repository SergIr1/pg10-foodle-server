import { initMongoConnection } from './db/initMongoConnection.js';
import { setupServer } from './server.js';

import { createDirIfNotExist } from './utils/createDirIfNotExists.js';
import { TEMP_UPLOAD_DIR, UPLOAD_DIR } from './constans/index.js';

const bootstrap = async () => {
  await initMongoConnection();
  await createDirIfNotExist(TEMP_UPLOAD_DIR);
  await createDirIfNotExist(UPLOAD_DIR);
  setupServer();
};

bootstrap();
