const request = require('supertest');
const app = require('../index');
const { getAuthToken } = require('./helpers');

describe('Boundary and Validation Tests', () => {

  let token;
  let noteId;

  beforeAll(async () => {
    token = await getAuthToken();

    const noteRes = await request(app)
      .post('/note/create')
      .set('Authorization', `Bearer ${token}`);

    noteId = noteRes.body.id;
  });

  afterAll(async () => {
    if (noteId) {
      await request(app)
        .delete(`/note/remove/${noteId}`)
        .set('Authorization', `Bearer ${token}`);
    }
  });

  // ==========================================
  // TASK TESTS
  // ==========================================

  test('BVA-T-01 Create task with empty title', async () => {

    const res = await request(app)
      .post('/task')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: ''
      });

    expect(res.statusCode).toBe(400);

  });

  test('BVA-T-02 Create task with spaces only title', async () => {

    const res = await request(app)
      .post('/task')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: '     '
      });

    expect(res.statusCode).toBe(400);

  });

  test('BVA-T-03 Create task without title field', async () => {

    const res = await request(app)
      .post('/task')
      .set('Authorization', `Bearer ${token}`)
      .send({});

    expect(res.statusCode).toBe(400);

  });

  // ==========================================
  // NOTES TESTS
  // ==========================================

  test('BVA-N-01 Save note with empty content', async () => {

    const res = await request(app)
      .put(`/note/save/${noteId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        ContentHTML: ''
      });

    expect(res.statusCode).toBe(400);

  });

  test('BVA-N-02 Save note without ContentHTML', async () => {

    const res = await request(app)
      .put(`/note/save/${noteId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({});

    expect(res.statusCode).toBe(400);

  });

  test('BVA-N-03 Rename note with empty name', async () => {

    const res = await request(app)
      .put(`/note/name/${noteId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        noteName: ''
      });

    expect(res.statusCode).toBe(400);

  });

  test('BVA-N-04 Rename note without noteName', async () => {

    const res = await request(app)
      .put(`/note/name/${noteId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({});

    expect(res.statusCode).toBe(400);

  });

});