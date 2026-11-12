const request = require('supertest');
const { app, pool } = require('../index');

afterAll(async () => {
    await pool.end();
});

describe('Back-end pages', () => {
    it('GET /api serves the back-end landing page', async () => {
        const res = await request(app).get('/api');
        expect(res.statusCode).toBe(200);
        expect(res.headers['content-type']).toMatch(/text\/html/);
        expect(res.text).toContain('doqa.io Backend');
    });

    it('GET /api/health reports the back-end and the database as up', async () => {
        const res = await request(app).get('/api/health');
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({ services: { backend: 'Active', database: 'Connected' } });
    });

    it('GET /api/docs/ serves Swagger UI', async () => {
        const res = await request(app).get('/api/docs/');
        expect(res.statusCode).toBe(200);
        expect(res.text).toContain('swagger-ui');
    });

    it('the routes are no longer exposed without the /api prefix', async () => {
        const res = await request(app).get('/resources');
        expect(res.statusCode).toBe(404);
    });
});

describe('Swagger document', () => {
    const swagger = require('../swagger.json');

    it('uses the current host so that "Try it out" targets the running server', () => {
        expect(swagger.host).toBeUndefined();
        expect(swagger.schemes).toBeUndefined();
        expect(swagger.basePath).toBe('/api');
    });
});

describe('Health check when the database is down', () => {
    it('GET /api/health answers 503 with the database marked as disconnected', async () => {
        const spy = jest.spyOn(pool, 'query').mockRejectedValueOnce(new Error('connection refused'));
        const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
        const res = await request(app).get('/api/health');
        expect(res.statusCode).toBe(503);
        expect(res.body.services.database).toBe('Disconnected');
        spy.mockRestore();
        errorSpy.mockRestore();
    });
});
