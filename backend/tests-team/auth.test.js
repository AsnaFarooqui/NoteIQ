const request = require('supertest');
const app = require('../index');

describe('Authentication Tests', () => {

  test('Signup should fail with empty body', async () => {

    const res = await request(app)
      .post('/auth/signup')
      .send({});

    expect(res.statusCode).toBe(400);

  });

  test('Signup should fail without password', async () => {

    const res = await request(app)
      .post('/auth/signup')
      .send({
        username: 'user1',
        email: 'user1@test.com'
      });

    expect(res.statusCode).toBe(400);

  });

  test('Login should fail with empty body', async () => {

    const res = await request(app)
      .post('/auth/login')
      .send({});

    expect(res.statusCode).toBe(400);

  });

  test('Login should fail with invalid credentials', async () => {

    const res = await request(app)
      .post('/auth/login')
      .send({
        usernameOrEmail: 'fake',
        password: 'fake'
      });

    expect(res.statusCode).toBe(401);

  });

});