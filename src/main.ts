import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as compression from 'compression';
import * as cookieParser from 'cookie-parser';
import * as cors from 'cors';

(async function () {
  const app = await NestFactory.create(AppModule);

  const origins = ['http://localhost:3000'];

  app.use(compression());
  app.use(cookieParser());

  // Use cors only in development environment
  process.env.NODE_ENV != "development" ?
  app.use(
    cors({
      credentials: true,
      origin: function (origin, callback) {
        if (origins.indexOf(origin) !== -1) {
          callback(null, true);
        } else {
          callback(new Error('Not allowed by CORS'));
        }
      },
    }),
  ) : null;

  const port = process.env.PORT || 3000;
  await app.listen(port);
})();
