const request = require('supertest');
const app = require('../index');

describe('Notes API Security Tests', () => {

  test('Create note should require authentication', async () => {

    const res = await request(app)
      .post('/note/create')
      .send({
        note_name:'Test'
      });

    expect([401,403]).toContain(res.statusCode);

  });

  test('Get notes should require authentication', async () => {

    const res = await request(app)
      .get('/note/all');

    expect([401,403]).toContain(res.statusCode);

  });

  test('Dashboard should require authentication', async () => {

    const res = await request(app)
      .get('/note/dashboard');

    expect([401,403]).toContain(res.statusCode);

  });

});