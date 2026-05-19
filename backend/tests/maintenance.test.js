jest.mock('../src/middleware/auth', () => ({
  authenticate: (req, res, next) => { req.user = { id: 'u', role: 'admin' }; next(); },
  authorize: () => (req, res, next) => next()
}));

jest.mock('../src/models/maintenance', () => ({
  find: jest.fn().mockResolvedValue([{ _id: 'm1', machineId: 'e1', last_service: new Date(), service_hours: 10, current_hours: 20, next_due: new Date(), status: 'Due' }]),
  countDocuments: jest.fn().mockResolvedValue(1),
  findById: jest.fn().mockResolvedValue({ _id: 'm1', machineId: 'e1', last_service: new Date(), service_hours: 10, current_hours: 20, next_due: new Date(), status: 'Due' }),
  create: jest.fn().mockImplementation(async (obj) => ({ _id: 'new', ...obj }))
}));

const request = require('supertest');
const app = require('../src/server');

describe('Maintenance API', () => {
  test('GET /api/maintenance should return items', async () => {
    const res = await request(app).get('/api/maintenance').set('Authorization', 'Bearer t');
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });

  test('POST /api/maintenance should create item', async () => {
    const payload = { machineId: '507f1f77bcf86cd799439011', service_hours: 5, current_hours: 6, last_service: new Date().toISOString(), next_due: new Date().toISOString() };
    const res = await request(app).post('/api/maintenance').send(payload).set('Authorization', 'Bearer t');
    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
  });
});
