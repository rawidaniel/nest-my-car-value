import { ValidationPipe } from '@nestjs/common';
const cookieSession = require('cookie-session');

export const setupAPP = (app) => {
  app.use(
    cookieSession({
      keys: ['nest-my-car-value'],
    }),
  );

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
};
