const request = require('supertest');
const app = require('../index');
const { getAuthToken } = require('./helpers');

describe('Task Integration Tests', () => {

  let token;
  let taskId;

  beforeAll(async () => {
    token = await getAuthToken();
    console.log("TOKEN:", token);
  });

  test('TC-T-01 Create Task', async () => {

    const res = await request(app)
      .post('/task')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Testing Task',
        description: 'Created by automation',
        priority: 'high'
      });

    expect(res.statusCode).toBe(201);

    taskId = res.body.id;

  });

  test('TC-T-02 Get Tasks', async () => {

    const res = await request(app)
      .get('/task')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);

  });

  test('TC-T-03 Update Task', async () => {

    const res = await request(app)
      .patch(`/task/${taskId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Updated Task'
      });

    expect(res.statusCode).toBe(200);

  });

  test('TC-T-04 Mark Complete', async () => {

    const res = await request(app)
      .patch(`/task/${taskId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        is_completed: true
      });

    expect(res.statusCode).toBe(200);

  });

  test('TC-T-05 Delete Task', async () => {

    const res = await request(app)
      .delete(`/task/${taskId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);

  });

});