import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import * as session from 'express-session';
import * as passport from 'passport';
import { ExpressAdapter } from '@nestjs/platform-express';
import * as express from 'express'

const oneWeek = 1000 * 60 * 60 * 24 * 7;

async function bootstrap() {
  const server = express();
  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(server)
  );
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true
  }));
//   app.setGlobalPrefix('auth');
  app.use(cookieParser());
  app.use(
		session({
			secret: 'pass',
			resave: false,
			saveUninitialized: true,
			cookie: {maxAge: oneWeek},
		})
	);
// const prismaService = app.get(PrismaService);
  // await prismaService.enableShutdownHooks(app);
  app.enableShutdownHooks();
	app.use(passport.initialize());
	app.use(passport.session());
  console.log('vite address 4:', process.env.VITE_ADDRESS)
	app.enableCors({
    origin : `http://${process.env.VITE_ADDRESS}:5173`,
    allowedHeaders: ['content-type'],
    credentials: true,
  });
  await app.listen(8000);
}
bootstrap();


