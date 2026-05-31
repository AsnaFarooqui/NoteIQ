const request = require('supertest');
const app = require('../index');
const { getAuthToken } = require('./helpers');

describe('Negative Tests', () => {

  let token;

  beforeAll(async () => {
    token = await getAuthToken();
  });

  test('NEG-01 Load non-existing note', async () => {

    const res = await request(app)
      .get('/note/load/999999')
      .set('Authorization', `Bearer ${token}`);

    expect([404,500]).toContain(res.statusCode);

  });

  test('NEG-02 Update non-existing note', async () => {

    const res = await request(app)
      .put('/note/name/999999')
      .set('Authorization', `Bearer ${token}`)
      .send({
        noteName: 'Test'
      });

    expect([404,500]).toContain(res.statusCode);

  });

  test('NEG-03 Delete non-existing task', async () => {

    const res = await request(app)
      .delete('/task/999999')
      .set('Authorization', `Bearer ${token}`);

    expect([404,500]).toContain(res.statusCode);

  });

  test('NEG-04 Update non-existing task', async () => {

    const res = await request(app)
      .patch('/task/999999')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Test'
      });

    expect([404,500]).toContain(res.statusCode);

  });

});