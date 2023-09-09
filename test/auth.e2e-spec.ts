import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { setupAPP } from '../src/setupApp';

describe('Authentication system', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('handle signup request', () => {
    const body = { email: 'test@test.com', password: '12345' };
    return request(app.getHttpServer())
      .post('/auth/signup')
      .send(body)
      .expect(201)
      .then((res) => {
        const { id, email } = res.body;
        expect(id).toBeDefined();
        expect(email).toEqual(body.email);
      });
  });

  it('signup as a new {body} then get the currently logged in {body}', async () => {
    const data = { email: 'test@gmail.com', password: '12345' };

    const res = await request(app.getHttpServer())
      .post('/auth/signup')
      .send(data);
    const cookie = res.get('Set-Cookie');
    console.log("print cookie",cookie)

    const { body } = await request(app.getHttpServer())
      .get('/auth/whoami')
      .set('Cookie', cookie)
      .expect(200);
    expect(body.email).toEqual(data.email);
  });
});
