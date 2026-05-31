const request = require('supertest');
const app = require('../index');

async function getAuthToken() {

  const loginRes = await request(app)
    .post('/auth/login')
    .send({
      usernameOrEmail: process.env.TEST_USERNAME,
      password: process.env.TEST_PASSWORD
    });

  console.log("=================================");
  console.log("LOGIN STATUS:", loginRes.statusCode);
  console.log("LOGIN BODY:", loginRes.body);
  console.log("=================================");

  if (!loginRes.body.token) {
    throw new Error(
      `No token returned. Status=${loginRes.statusCode} Body=${JSON.stringify(loginRes.body)}`
    );
  }

  return loginRes.body.token;
}

module.exports = { getAuthToken };