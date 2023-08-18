import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import * as session from 'express-session';
import * as passport from 'passport';


const oneWeek = 1000 * 60 * 60 * 24 * 7;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true
  }));
//   app.setGlobalPrefix('auth');
  app.use(cookieParser());
//   app.use(
// 		session({
// 			secret: 'pass',
// 			resave: false,
// 			saveUninitialized: true,
// 			cookie: {maxAge: oneWeek},
// 		})
// 	);
	app.use(passport.initialize());
	app.use(passport.session());
	app.enableCors({
		origin : '*',
		credentials : true
	  });
  await app.listen(8000);
}
bootstrap();


