const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const express = require('express');
const authRoutes = require('../src/routes/authRoutes');
const attendanceRoutes = require('../src/routes/attendanceRoutes');
const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/attendance', attendanceRoutes);
const User = require('../src/models/User');
const Attendance = require('../src/models/attendance');

jest.setTimeout(30000);
let mongoServer;
let adminToken;
let driverToken;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  process.env.MONGODB_URI = uri;
  process.env.JWT_SECRET = 'testsecret';
  await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await User.deleteMany({});
  await Attendance.deleteMany({});
});

describe('Auth and Attendance API', () => {
  test('Register and login users, then CRUD attendance', async () => {
    // Register admin
    const adminRes = await request(app).post('/api/auth/register').send({
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@example.com',
      password: 'password',
      role: 'admin'
    });
    expect(adminRes.statusCode).toBe(201);
    expect(adminRes.body.token).toBeDefined();
    adminToken = adminRes.body.token;

    // Register driver
    const driverRes = await request(app).post('/api/auth/register').send({
      firstName: 'Driver',
      lastName: 'One',
      email: 'driver@example.com',
      password: 'password',
      role: 'driver'
    });
    expect(driverRes.statusCode).toBe(201);
    driverToken = driverRes.body.token;

    // Driver creates attendance
    const createRes = await request(app)
      .post('/api/attendance')
      .set('Authorization', `Bearer ${driverToken}`)
      .send({ date: new Date().toISOString(), name: 'Driver One', role: 'driver', location: 'Garage A' });
    expect(createRes.statusCode).toBe(201);
    const record = createRes.body.record;
    expect(record).toHaveProperty('_id');

    // Admin lists attendance
    const listRes = await request(app)
      .get('/api/attendance')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(listRes.statusCode).toBe(200);
    expect(listRes.body.total).toBe(1);

    // Admin gets single record
    const getRes = await request(app)
      .get(`/api/attendance/${record._id}`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect(getRes.statusCode).toBe(200);
    expect(getRes.body.record._id).toBe(record._id);

    // Admin updates record
    const updRes = await request(app)
      .put(`/api/attendance/${record._id}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ location: 'Garage B' });
    expect(updRes.statusCode).toBe(200);
    expect(updRes.body.record.location).toBe('Garage B');

    // Admin deletes record
    const delRes = await request(app)
      .delete(`/api/attendance/${record._id}`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect(delRes.statusCode).toBe(200);

    // Stats should be zero now
    const statsRes = await request(app)
      .get('/api/attendance/stats')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(statsRes.statusCode).toBe(200);
    expect(statsRes.body.stats.total).toBe(0);
  });

  test('Validation errors for attendance creation', async () => {
    // Register driver
    const driverRes = await request(app).post('/api/auth/register').send({
      firstName: 'Driver',
      lastName: 'One',
      email: 'driver2@example.com',
      password: 'password'
    });
    driverToken = driverRes.body.token;

    // Missing required fields - name/role/location enforced by route validators
    const badRes = await request(app)
      .post('/api/attendance')
      .set('Authorization', `Bearer ${driverToken}`)
      .send({});
    expect(badRes.statusCode).toBe(400);
    expect(badRes.body.success).toBe(false);
  });
});
