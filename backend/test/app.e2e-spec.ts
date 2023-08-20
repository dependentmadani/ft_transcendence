import {Test} from '@nestjs/testing'
import { AppModule } from '../src/app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { PrismaService } from '../src/prisma/prisma.service';
import * as pactum from 'pactum'
import { AuthDto } from '../src/auth/dto';

describe('App e2e',() => {

  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {

      const moduleRef = await Test.createTestingModule({
        imports: [AppModule],
      }).compile();

      app = moduleRef.createNestApplication();
      app.useGlobalPipes(new ValidationPipe({
        whitelist: true
      }));
      await app.init();
      await app.listen(3333);

      prisma = app.get(PrismaService);
      await prisma.cleanDb();
  });

  afterAll(() => {
    app.close();
  })

  
  describe('Auth', () => {
    describe('signUp', () => {
      const dto: AuthDto = {
        username: 'mbadaoui',
        password: 'something nadi canadi',
      };

      it('should throw if email empty', () => {
        return pactum
          .spec()
          .post(`http://${process.env.ADDRESS}:3333/auth/signin`)
          .withBody({
            password: dto.password,
          })
          .expectStatus(400); // give me the uncorrect status code, need to be checked
      });
      it('should throw if password empty', () => {
        return pactum
          .spec()
          .post(`http://${process.env.ADDRESS}:3333/auth/signin`)
          .withBody({
            username: dto.username,
          })
          .expectStatus(400); // give me the uncorrect status code, need to be checked
      });
      it('should throw if no body provided', () => {
        return pactum
          .spec()
          .post(`http://${process.env.ADDRESS}:3333/auth/signin`)
          .expectStatus(400); // give me the uncorrect status code, need to be checked
      });


      it('should sign up', () => {
        return pactum.spec()
        .post(`http://${process.env.ADDRESS}:3333/auth/signup`)
        .withBody(dto)
        .expectStatus(201);
      })
    })


    describe('signIn', () => {})

  })
  describe('User', () => {
    describe('Get me', () => {})
    
    describe('Edit user', () => {})
  })

  describe('Chats', () => {
    describe('Create chat', () => {})

    describe('Get chat', () => {})
    
    describe('Get chat by id', () => {})
    
    describe('Get chat by id', () => {})

    describe('Delete chat ', () => {})

  })

});