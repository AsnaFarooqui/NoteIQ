const request = require('supertest');
const app = require('../index');

describe('Task API Security Tests', () => {

  test('Get tasks should require authentication', async () => {

    const res = await request(app)
      .get('/task');

    expect([401,403]).toContain(res.statusCode);

  });

  test('Create task should require authentication', async () => {

    const res = await request(app)
      .post('/task')
      .send({
        title:'Task'
      });

    expect([401,403]).toContain(res.statusCode);

  });

  test('Delete task should require authentication', async () => {

    const res = await request(app)
      .delete('/task/1');

    expect([401,403]).toContain(res.statusCode);

  });

});