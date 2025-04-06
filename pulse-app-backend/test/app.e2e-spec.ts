/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  const testUser = {
    email: `test-${Date.now()}@example.com`,
    password: 'password123',
  };
  let authToken: string;
  let createdSurveyId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();
  });

  beforeEach(() => {
    authToken = '';
    createdSurveyId = '';
  });

  afterAll(async () => {
    await app.close();
  });

  it('/ (GET) - Default endpoint', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

  describe('Auth Flow', () => {
    it('POST /auth/register - Should register a new user', async () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .send(testUser)
        .expect(201)
        .then((res) => {
          expect(res.body).toBeDefined();
          expect(res.body.email).toEqual(testUser.email);
          expect(res.body.role).toEqual('employee');
          expect(res.body.passwordHash).toBeUndefined();
          expect(res.body._id).toBeDefined();
          expect(typeof res.body._id).toBe('string');
        });
    });

    it('POST /auth/register - Should fail to register duplicate user', async () => {
      try {
        await request(app.getHttpServer())
          .post('/auth/register')
          .send(testUser);
      } catch (error: any) {
        if (error.status !== 409) throw error;
      }

      // Attempt to register again - THIS is the actual test, should be 409
      return request(app.getHttpServer())
        .post('/auth/register')
        .send(testUser)
        .expect(409); // Correct expectation
    });

    it('POST /auth/login - Should login the registered user and return JWT', async () => {
      // Directly attempt login, assuming user exists from previous tests
      return request(app.getHttpServer())
        .post('/auth/login')
        .send(testUser)
        .expect(200) // Login returns 200 OK, not 201 Created
        .then((res) => {
          expect(res.body).toBeDefined();
          expect(res.body.access_token).toBeDefined();
          authToken = res.body.access_token;
        });
    });

    it('POST /auth/login - Should fail with wrong password', async () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: testUser.email, password: 'wrongpassword' })
        .expect(401); // Unauthorized
    });

    it('GET /auth/profile - Should get user profile with valid JWT', async () => {
      await request(app.getHttpServer()).post('/auth/register').send(testUser);
      const loginRes = await request(app.getHttpServer())
        .post('/auth/login')
        .send(testUser);
      authToken = loginRes.body.access_token;
      return request(app.getHttpServer())
        .get('/auth/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .then((res) => {
          expect(res.body).toBeDefined();
          expect(res.body.email).toEqual(testUser.email);
          expect(res.body.role).toBeDefined();
          expect(res.body.userId).toBeDefined();
          expect(typeof res.body.userId).toBe('string');
        });
    });

    it('GET /auth/profile - Should fail without JWT', async () => {
      return request(app.getHttpServer()).get('/auth/profile').expect(401);
    });
  });

  describe('Survey Flow (Employee)', () => {
    beforeEach(async () => {
      await request(app.getHttpServer()).post('/auth/register').send(testUser);
      const loginRes = await request(app.getHttpServer())
        .post('/auth/login')
        .send(testUser);
      authToken = loginRes.body.access_token;
    });

    it('POST /surveys - Should submit a survey response', async () => {
      const surveyResponse = { response: 'Feeling good this week!' };
      return request(app.getHttpServer())
        .post('/surveys')
        .set('Authorization', `Bearer ${authToken}`)
        .send(surveyResponse)
        .expect(201)
        .then((res) => {
          expect(res.body).toBeDefined();
          expect(res.body._id).toBeDefined();
          expect(typeof res.body._id).toBe('string');
          expect(res.body.response).toEqual(surveyResponse.response);
          expect(res.body.userId).toBeDefined();
          expect(typeof res.body.userId).toBe('string');
          createdSurveyId = res.body._id;
        });
    });

    it('POST /surveys - Should fail to submit without response', async () => {
      return request(app.getHttpServer())
        .post('/surveys')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ response: '' })
        .expect(400);
    });

    it('GET /surveys - Should retrieve own submitted survey', async () => {
      const surveyResponse = { response: 'My test response' };
      const postRes = await request(app.getHttpServer())
        .post('/surveys')
        .set('Authorization', `Bearer ${authToken}`)
        .send(surveyResponse);
      createdSurveyId = postRes.body._id;

      return request(app.getHttpServer())
        .get('/surveys')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .then((res) => {
          expect(res.body).toBeInstanceOf(Array);
          expect(res.body.length).toBeGreaterThan(0);
          const foundSurvey = res.body.find((s) => s._id === createdSurveyId);
          expect(foundSurvey).toBeDefined();
          expect(foundSurvey.response).toEqual(surveyResponse.response);
        });
    });

    it('GET /surveys/all - Should be forbidden for employee role', async () => {
      return request(app.getHttpServer())
        .get('/surveys/all')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(403);
    });
  });
});
