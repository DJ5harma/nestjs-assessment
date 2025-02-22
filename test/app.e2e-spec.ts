import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('UsersController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/users (POST) - Create User', async () => {
    const createUserDto = {
      email: 'test@example.com',
      username: 'testuser',
      password: 'password',
      confirmPassword: 'password',
    };

    const response = await request(app.getHttpServer())
      .post('/users')
      .send(createUserDto)
      .expect(201);

    expect(response.body.message).toBe('User created successfully');
  });

  it('/users/login (POST) - Login User', async () => {
    const loginUserDto = {
      email: 'test@example.com',
      password: 'password',
    };

    const response = await request(app.getHttpServer())
      .post('/users/login')
      .send(loginUserDto)
      .expect(201);

    expect(response.body.message).toBe('Login successful');
  });

  it('/users/:id (PATCH) - Update User', async () => {
    const updateUserDto = {
      username: 'updateduser',
      password: 'newpassword',
      confirmPassword: 'newpassword',
    };

    // First, login to get the JWT token
    const loginResponse = await request(app.getHttpServer())
      .post('/users/login')
      .send({ email: 'test@example.com', password: 'password' });

    const token = loginResponse.headers['set-cookie'][0].split(';')[0];

    // Then, update the user
    const response = await request(app.getHttpServer())
      .patch('/users/1')
      .set('Cookie', token)
      .send(updateUserDto)
      .expect(201);

    expect(response.body.message).toBe('User updated successfully');
  });

  it('/users/:id (DELETE) - Delete User', async () => {
    // First, login to get the JWT token
    const loginResponse = await request(app.getHttpServer())
      .post('/users/login')
      .send({ email: 'test@example.com', password: 'password' });

    const token = loginResponse.headers['set-cookie'][0].split(';')[0];

    // Then, delete the user
    const response = await request(app.getHttpServer())
      .delete('/users/1')
      .set('Cookie', token)
      .expect(201);

    expect(response.body.message).toBe('User deleted successfully');
  });
});
