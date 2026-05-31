const request = require('supertest');
const app = require('../index');

describe('JWT Security Tests', () => {

  test('Should reject access without token', async () => {

    const res = await request(app)
      .get('/user/info');

    expect([401,403]).toContain(res.statusCode);

  });

  test('Should reject invalid token', async () => {

    const res = await request(app)
      .get('/user/info')
      .set('Authorization','Bearer invalidtoken');

    expect([401,403]).toContain(res.statusCode);

  });

});