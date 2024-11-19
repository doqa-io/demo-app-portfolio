const request = require('supertest');
const app = require('../index'); // Import the app without starting the server

describe('GET /api/resources', () => {
  it('should return an array of resources', async () => {
    const res = await request(app).get('/api/resources');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
