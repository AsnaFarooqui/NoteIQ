const request = require('supertest');
const app = require('../index');
const { getAuthToken } = require('./helpers');

describe('Notes Integration Tests', () => {

  let token;
  let noteId;

  beforeAll(async () => {
    token = await getAuthToken();
  });

  test('TC-N-01 Create Note', async () => {

    const res = await request(app)
      .post('/note/create')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);

    noteId = res.body.id;

  });

  test('TC-N-02 Get Notes', async () => {

    const res = await request(app)
      .get('/note/all')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);

  });

  test('TC-N-03 Rename Note', async () => {

    const res = await request(app)
      .put(`/note/name/${noteId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        noteName: 'Integration Test Note'
      });

    expect(res.statusCode).toBe(200);

  });

  test('TC-N-04 Save Note Content', async () => {

    const res = await request(app)
      .put(`/note/save/${noteId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        ContentHTML: '<h1>Testing</h1>'
      });

    expect(res.statusCode).toBe(200);

  });

  test('TC-N-05 Load Note Content', async () => {

    const res = await request(app)
      .get(`/note/load/${noteId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);

  });

  test('TC-N-06 Delete Note', async () => {

    const res = await request(app)
      .delete(`/note/remove/${noteId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);

  });

});