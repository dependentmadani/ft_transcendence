import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import * as session from 'express-session';
import * as passport from 'passport';
// import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';


const oneWeek = 1000 * 60 * 60 * 24 * 7;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  

//   // enable Cors
//   const corsOptions: CorsOptions = {
//     origin: true, // You can set specific origins or true to allow all
//     methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
//     credentials: true,
//     preflightContinue: false,
//     optionsSuccessStatus: 204,
//   };
//   app.enableCors(corsOptions);
	

	
	app.enableCors({
		origin: 'http://localhost:5173'
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


