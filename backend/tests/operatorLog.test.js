jest.mock('../src/middleware/auth', () => ({
  authenticate: (req, res, next) => { req.user = { id: 'u', role: 'admin' }; next(); },
  authorize: () => (req, res, next) => next()
}));

jest.mock('../src/models/operator_log', () => ({
  find: jest.fn().mockResolvedValue([{ _id: 'o1', machineId: 'e1', operatorName: 'Op', shift: 'A', hours: 8, efficiency: 90 }]),
  countDocuments: jest.fn().mockResolvedValue(1),
  findById: jest.fn().mockResolvedValue({ _id: 'o1', machineId: 'e1', operatorName: 'Op', shift: 'A', hours: 8, efficiency: 90 }),
  create: jest.fn().mockImplementation(async (obj) => ({ _id: 'new', ...obj }))
}));

const request = require('supertest');
const app = require('../src/server');

describe('OperatorLog API', () => {
  test('GET /api/operator-logs should return logs', async () => {
    const res = await request(app).get('/api/operator-logs').set('Authorization', 'Bearer t');
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });

  test('POST /api/operator-logs should create log', async () => {
    const payload = { machineId: '507f1f77bcf86cd799439011', operatorName: 'Op', shift: 'B', hours: 7, efficiency: 85 };
    const res = await request(app).post('/api/operator-logs').send(payload).set('Authorization', 'Bearer t');
    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
  });
});
