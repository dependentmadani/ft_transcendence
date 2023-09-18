import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import * as session from 'express-session';
import * as passport from 'passport';
// import { IoAdapter } from '@nestjs/platform-socket.io';
// import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';


const oneWeek = 1000 * 60 * 60 * 24 * 7;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: `http://localhost:5173`,
    allowedHeaders: ['content-type'],
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true
  }));
  app.use(cookieParser());
  app.use(
		session({
			secret: 'pass',
			resave: false,
			saveUninitialized: true,
			cookie: {maxAge: oneWeek},
		})
	);
	app.use(passport.initialize());
	app.use(passport.session());
  await app.listen(8000);
}
bootstrap();


