import { NestFactory } from '@nestjs/core';
//import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import {
  DocumentBuilder,
  SwaggerDocumentOptions,
  SwaggerModule,
} from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
const cookieSession = require('cookie-session');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // app.use(
  //   cookieSession({
  //     keys: ['nest-my-car-value'],
  //   }),
  // );
  // app.useGlobalPipes(
  //   new ValidationPipe({
  //     whitelist: true, // remove all the properties that are not in the DTO
  //   }),
  // );
  const configService = app.get(ConfigService);
  console.log(
    configService.get('COOKIE_SESSION_KEY'),
    typeof configService.get('COOKIE_SESSION_KEY'),
  );
  const config = new DocumentBuilder()
    .setTitle('My car value')
    .setDescription(
      'The my car value API used to estimate the value of a car basd on the make, model, longtude, latitude, year and mileage',
    )
    .setVersion('1.0')
    .addTag('My car value')
    .addCookieAuth(
      'optional-session-id',
      {
        type: 'http',
        in: 'Header',
        scheme: 'cookie',
      },
      'in-app-cookie-name',
    )
    .build();
  const options: SwaggerDocumentOptions = {
    operationIdFactory: (controllerKey: string, methodKey: string) => methodKey,
  };
  const document = SwaggerModule.createDocument(app, config, options);
  SwaggerModule.setup('api', app, document);
  await app.listen(8000);
}
bootstrap();
