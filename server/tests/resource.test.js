const request = require('supertest');
const { app, pool } = require('../index');

beforeEach(async () => {
    await pool.query('TRUNCATE TABLE resources RESTART IDENTITY;');
});

afterAll(async () => {
    await pool.end();
    console.log('Active connections:', pool.totalCount);
});

describe('Resources API', () => {
    describe('GET /api/resources', () => {
        it('should return an array of resources', async () => {
            const res = await request(app).get('/api/resources');
            expect(res.statusCode).toBe(200);
            expect(Array.isArray(res.body)).toBe(true);
        });

        it('should return resources if they exist', async () => {
            const newResource = { name: "Test Resource" };
            await request(app).post('/api/resources').send(newResource);

            const res = await request(app).get('/api/resources');
            expect(res.statusCode).toBe(200);
            expect(res.body.length).toBeGreaterThan(0);
            expect(res.body[0]).toMatchObject(newResource);
        });
    });

    describe('POST /api/resources', () => {
        it('should add a new resource', async () => {
            const newResource = { name: "New Resource" };
            const res = await request(app)
                .post('/api/resources')
                .send(newResource);

            expect(res.statusCode).toBe(201);
            expect(res.body.name).toBe(newResource.name);

            const getRes = await request(app).get('/api/resources');
            expect(getRes.body).toContainEqual(expect.objectContaining(newResource));
        });

        it('should return 400 if required fields are missing', async () => {
            const res = await request(app)
                .post('/api/resources')
                .send({});

            expect(res.statusCode).toBe(400);
            expect(res.body.error).toBe("Name is required");
        });

        it('should add a new resource to the database', async () => {
            const newResource = { name: "Database Resource" };
            const res = await request(app)
                .post('/api/resources')
                .send(newResource);

            expect(res.statusCode).toBe(201);
            expect(res.body.name).toBe(newResource.name);

            const dbRes = await pool.query('SELECT * FROM resources WHERE id = $1', [res.body.id]);
            expect(dbRes.rows.length).toBe(1);
            expect(dbRes.rows[0].name).toBe(newResource.name);
        });
    });

    describe('GET /api/resources/:id', () => {
        it('should fetch a specific resource by ID', async () => {
            const resource = { name: "Specific Resource" };
            const postRes = await request(app).post('/api/resources').send(resource);

            const res = await request(app).get(`/api/resources/${postRes.body.id}`);
            expect(res.statusCode).toBe(200);
            expect(res.body).toMatchObject(resource);
        });

        it('should return 404 if the resource is not found', async () => {
            const res = await request(app).get('/api/resources/999');
            expect(res.statusCode).toBe(404);
            expect(res.body.error).toBe("Resource not found");
        });
    });

    describe('PUT /api/resources/:id', () => {
        it('should update a resource', async () => {
            const resource = { name: "Updatable Resource" };
            const postRes = await request(app).post('/api/resources').send(resource);

            const updatedResource = { name: "Updated Resource" };
            const res = await request(app)
                .put(`/api/resources/${postRes.body.id}`)
                .send(updatedResource);

            expect(res.statusCode).toBe(200);
            expect(res.body.name).toBe(updatedResource.name);
        });

        it('should return 404 if the resource does not exist', async () => {
            const res = await request(app).put('/api/resources/999').send({ name: "Nonexistent Resource" });
            expect(res.statusCode).toBe(404);
            expect(res.body.error).toBe("Resource not found");
        });
    });

    describe('DELETE /api/resources/:id', () => {
        it('should delete a resource', async () => {
            const resource = { name: "Deletable Resource" };
            const postRes = await request(app).post('/api/resources').send(resource);

            const res = await request(app).delete(`/api/resources/${postRes.body.id}`);
            expect(res.statusCode).toBe(200);
            expect(res.body.message).toBe("Resource deleted");

            const getRes = await request(app).get(`/api/resources/${postRes.body.id}`);
            expect(getRes.statusCode).toBe(404);
            expect(getRes.body.error).toBe("Resource not found");
        });

        it('should return 404 if the resource does not exist', async () => {
            const res = await request(app).delete('/api/resources/999');
            expect(res.statusCode).toBe(404);
            expect(res.body.error).toBe("Resource not found");
        });
    });
});