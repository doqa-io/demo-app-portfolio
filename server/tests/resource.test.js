const request = require('supertest');
const app = require('../index');

describe('Resources API', () => {
  describe('GET /api/resources', () => {
        it('should return an array of resources', async () => {
            const res = await request(app).get('/api/resources');
            expect(res.statusCode).toBe(200);
            expect(Array.isArray(res.body)).toBe(true);
        });

        it('should return resources if they exist', async () => {
            // Adding a mock resource
            const newResource = { id: 1, name: "Test Resource" };
            await request(app).post('/api/resources').send(newResource);

            const res = await request(app).get('/api/resources');
            expect(res.statusCode).toBe(200);
            expect(res.body.length).toBeGreaterThan(0);
            expect(res.body[0]).toMatchObject(newResource);
        });
    });

  describe('POST /api/resources', () => {
        it('should add a new resource', async () => {
            const newResource = { id: 2, name: "New Resource" };
            const res = await request(app)
            .post('/api/resources')
            .send(newResource);
      
            expect(res.statusCode).toBe(201);
            expect(res.body).toMatchObject(newResource);
  
            // Verify it was added
            const getRes = await request(app).get('/api/resources');
            expect(getRes.body).toContainEqual(newResource);
        });
  
        it('should return 400 if required fields are missing', async () => {
            const res = await request(app)
            .post('/api/resources')
            .send({}); // Empty body
  
            expect(res.statusCode).toBe(400);
            expect(res.body.error).toBe("Resource validation failed");
        });
    });

  describe('GET /api/resources/:id', () => {
        it('should fetch a specific resource by ID', async () => {
            const resource = { id: 3, name: "Specific Resource" };
            await request(app).post('/api/resources').send(resource);
  
            const res = await request(app).get(`/api/resources/${resource.id}`);
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
            const resource = { id: 4, name: "Updatable Resource" };
            await request(app).post('/api/resources').send(resource);
  
            const updatedResource = { name: "Updated Resource" };
            const res = await request(app)
            .put(`/api/resources/${resource.id}`)
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
            const resource = { id: 5, name: "Deletable Resource" };
            await request(app).post('/api/resources').send(resource);

            const res = await request(app).delete(`/api/resources/${resource.id}`);
            expect(res.statusCode).toBe(200);
            expect(res.body.message).toBe("Resource deleted");

            // Confirm deletion
            const getRes = await request(app).get(`/api/resources/${resource.id}`);
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