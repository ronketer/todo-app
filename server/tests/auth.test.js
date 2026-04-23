const request = require('supertest');
const app = require('../app');

describe('POST /api/v1/auth/register', () => {
  it('should register a new user and return a token', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({ name: 'Test User', email: 'newuser@example.com', password: 'TestPassword123!' });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('token');
  });

  it('should reject registration with missing fields', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({ name: 'Test User' });

    expect(res.status).toBe(400);
  });

  it('should reject registration with blank fields', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({ name: '  ', email: 'a@b.com', password: 'pass123' });

    expect(res.status).toBe(400);
  });

  it('should reject duplicate email', async () => {
    const user = { name: 'Dup', email: 'dup@example.com', password: 'TestPassword123!' };
    await request(app).post('/api/v1/auth/register').send(user);
    const res = await request(app).post('/api/v1/auth/register').send(user);

    expect(res.status).toBeGreaterThanOrEqual(400);
  });
});

describe('POST /api/v1/auth/login', () => {
  const creds = { name: 'Login User', email: 'login@example.com', password: 'TestPassword123!' };

  beforeEach(async () => {
    await request(app).post('/api/v1/auth/register').send(creds);
  });

  it('should return a token on valid credentials', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: creds.email, password: creds.password });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
  });

  it('should reject login with wrong password', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: creds.email, password: 'WrongPassword!' });

    expect(res.status).toBe(401);
  });

  it('should reject login with non-existent email', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'nobody@example.com', password: 'TestPassword123!' });

    expect(res.status).toBe(401);
  });

  it('should reject login with missing credentials', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({});

    expect(res.status).toBe(400);
  });
});
