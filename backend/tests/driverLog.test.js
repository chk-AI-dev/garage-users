jest.mock('../src/middleware/auth', () => ({
  authenticate: (req, res, next) => { req.user = { id: 'u', role: 'admin' }; next(); },
  authorize: () => (req, res, next) => next()
}));

jest.mock('../src/models/driver_log', () => ({
  find: jest.fn().mockResolvedValue([{ _id: 'g1', date: new Date(), tipperId: 't1', driverName: 'Dan', trips: 3, fuelUsed: 10 }]),
  countDocuments: jest.fn().mockResolvedValue(1),
  findById: jest.fn().mockResolvedValue({ _id: 'g1', date: new Date(), tipperId: 't1', driverName: 'Dan', trips: 3, fuelUsed: 10 }),
  create: jest.fn().mockImplementation(async (obj) => ({ _id: 'new', ...obj }))
}));

const request = require('supertest');
const app = require('../src/server');

describe('DriverLog API', () => {
  test('GET /api/driver-logs should return logs', async () => {
    const res = await request(app).get('/api/driver-logs').set('Authorization', 'Bearer t');
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });

  test('POST /api/driver-logs should create log', async () => {
    const payload = { tipperId: '507f1f77bcf86cd799439011', driverName: 'Dan', trips: 2, fuelUsed: 5, tripsPerLiter: 0.4 };
    const res = await request(app).post('/api/driver-logs').send(payload).set('Authorization', 'Bearer t');
    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
  });
});
