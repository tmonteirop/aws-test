import request from 'supertest';

import app from '../../../app.js';

describe('first login test username', () => {
    it('should respond with a 200 status code', async () => {
        const response = await request(app).post('/auth').send({
            username: 'username',
            password: 'username',
        });
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('token');
    });
});

// Test

// describe('Test first username login', () => {
//     it('should be able login', () => {
//         expect(2 + 2).toBe(4);
//     });
// });
