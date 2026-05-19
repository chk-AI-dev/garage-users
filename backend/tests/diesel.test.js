jest.mock('../src/middleware/auth', () => ({
  authenticate: (req, res, next) => { req.user = { id: 'testUser', role: 'admin' }; next(); },
  authorize: () => (req, res, next) => next()
}));

jest.mock('../src/models/diesel_log', () => ({
  find: jest.fn().mockResolvedValue([{ _id: 'd1', date: new Date(), opening: 100, received: 50, issued: 20, closing: 130 }]),
  countDocuments: jest.fn().mockResolvedValue(1),
  findById: jest.fn().mockResolvedValue({ _id: 'd1', date: new Date(), opening: 100, received: 50, issued: 20, closing: 130 }),
  create: jest.fn().mockImplementation(async (obj) => ({ _id: 'new', ...obj }))
}));

const request = require('supertest');
const app = require('../src/server');

describe('Diesel API', () => {
  test('GET /api/diesel should return logs', async () => {
    const res = await request(app).get('/api/diesel').set('Authorization', 'Bearer t');
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.logs)).toBe(true);
  });

  test('POST /api/diesel should create log', async () => {
    const payload = { opening: 10, received: 5, issued: 2, closing: 13 };
    const res = await request(app).post('/api/diesel').send(payload).set('Authorization', 'Bearer t');
    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.log.opening).toBe(10);
  });
});
