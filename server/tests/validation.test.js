const request = require('supertest');
const { app, pool } = require('../index');

let existingId;

beforeEach(async () => {
    await pool.query('TRUNCATE TABLE resources RESTART IDENTITY;');
    const res = await request(app).post('/api/resources').send({ name: 'Existing' });
    existingId = res.body.id;
});

afterAll(async () => {
    await pool.end();
});

describe('Input validation', () => {
    describe('invalid id', () => {
        const invalidIds = ['abc', '1.5', '-1', '0', '99999999999'];

        it.each(invalidIds)('GET /api/resources/%s answers 400', async (id) => {
            const res = await request(app).get(`/api/resources/${id}`);
            expect(res.statusCode).toBe(400);
            expect(res.body.error).toBe('Invalid id');
        });

        it.each(invalidIds)('PUT /api/resources/%s answers 400', async (id) => {
            const res = await request(app).put(`/api/resources/${id}`).send({ name: 'x' });
            expect(res.statusCode).toBe(400);
            expect(res.body.error).toBe('Invalid id');
        });

        it.each(invalidIds)('DELETE /api/resources/%s answers 400', async (id) => {
            const res = await request(app).delete(`/api/resources/${id}`);
            expect(res.statusCode).toBe(400);
            expect(res.body.error).toBe('Invalid id');
        });
    });

    describe('invalid name', () => {
        const cases = [
            ['missing', {}, 'Name is required'],
            ['null', { name: null }, 'Name is required'],
            ['empty', { name: '' }, 'Name is required'],
            ['blank', { name: '   ' }, 'Name is required'],
            ['a number', { name: 42 }, 'Name must be a string'],
            ['an object', { name: { value: 'x' } }, 'Name must be a string'],
            ['101 characters', { name: 'a'.repeat(101) }, 'Name must be at most 100 characters'],
        ];

        it.each(cases)('POST with a name %s answers 400', async (_label, body, message) => {
            const res = await request(app).post('/api/resources').send(body);
            expect(res.statusCode).toBe(400);
            expect(res.body.error).toBe(message);
        });

        it.each(cases)('PUT with a name %s answers 400 and leaves the resource unchanged', async (_label, body, message) => {
            const res = await request(app).put(`/api/resources/${existingId}`).send(body);
            expect(res.statusCode).toBe(400);
            expect(res.body.error).toBe(message);

            const after = await request(app).get(`/api/resources/${existingId}`);
            expect(after.body.name).toBe('Existing');
        });

        it('accepts a name of exactly 100 characters', async () => {
            const name = 'a'.repeat(100);
            const res = await request(app).post('/api/resources').send({ name });
            expect(res.statusCode).toBe(201);
            expect(res.body.name).toBe(name);
        });

        it('trims the surrounding spaces of the name', async () => {
            const res = await request(app).post('/api/resources').send({ name: '  Padded  ' });
            expect(res.statusCode).toBe(201);
            expect(res.body.name).toBe('Padded');
        });
    });

    it('a malformed JSON body answers 400', async () => {
        const res = await request(app)
            .post('/api/resources')
            .set('Content-Type', 'application/json')
            .send('{"name": ');
        expect(res.statusCode).toBe(400);
        expect(res.body.error).toBe('Malformed JSON body');
    });
});

describe('Database errors', () => {
    it('answers 500 without leaking details when the database fails', async () => {
        const spy = jest.spyOn(pool, 'query').mockRejectedValueOnce(new Error('boom: secret detail'));
        const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
        const res = await request(app).get('/api/resources');
        expect(res.statusCode).toBe(500);
        expect(res.body).toEqual({ error: 'Internal Server Error' });
        spy.mockRestore();
        errorSpy.mockRestore();
    });
});
