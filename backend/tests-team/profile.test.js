const request = require('supertest');
const app = require('../index');

describe('Profile API Security Tests', () => {

  test('Profile info requires authentication', async () => {

    const res = await request(app)
      .get('/user/info');

    expect([401,403]).toContain(res.statusCode);

  });

  test('Username update requires authentication', async () => {

    const res = await request(app)
      .patch('/user/username')
      .send({
        username:'newname'
      });

    expect([401,403]).toContain(res.statusCode);

  });

});