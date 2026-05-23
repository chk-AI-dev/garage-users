jest.mock('../src/middleware/auth', () => ({
  authenticate: (req, res, next) => { req.user = { id: 'testUser', role: 'admin', firstName: 'Test' }; next(); },
  authorize: () => (req, res, next) => next()
}));

// test code for attendance routes, mocking the Attendance model 
jest.mock('../src/models/attendance', () => ({
  find: jest.fn().mockResolvedValue([{ _id: '1', date: new Date(), name: 'Alice', role: 'driver', location: 'Site A', timestamp: new Date() }]),
  countDocuments: jest.fn().mockResolvedValue(1),
  findById: jest.fn().mockResolvedValue({ _id: '1', date: new Date(), name: 'Alice', role: 'driver', location: 'Site A', timestamp: new Date() }),
  create: jest.fn().mockImplementation(async (obj) => ({ _id: 'new', ...obj }))
}));

const request = require('supertest');
const app = require('../src/server');

describe('Attendance API', () => {
  test('GET /api/attendance should return records', async () => {
    const res = await request(app).get('/api/attendance').set('Authorization', 'Bearer faketoken');
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.records)).toBe(true);
  });

  test('POST /api/attendance should create record', async () => {
    const payload = { name: 'Bob', role: 'driver', location: 'Site B' };
    const res = await request(app).post('/api/attendance').send(payload).set('Authorization', 'Bearer faketoken');
    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.record.name).toBe('Bob');
  });
});
