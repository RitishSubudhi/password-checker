process.env.NODE_ENV = 'test';

const request = require('supertest');
const app = require('../src/app');

describe('POST /api/check', () => {

  it('should return Very Weak for "123"', async () => {
    const res = await request(app).post('/api/check').send({ password: '123' });
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.score).toBe(0);
    expect(res.body.data.strength).toBe('Very Weak');
  });

  it('should return Strong or Very Strong for a complex password', async () => {
    const res = await request(app).post('/api/check').send({ password: 'C0ffee!Rain#Mountain7' });
    expect(res.statusCode).toBe(200);
    expect(res.body.data.score).toBeGreaterThanOrEqual(3);
  });

  it('should return 400 if no password provided', async () => {
    const res = await request(app).post('/api/check').send({});
    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('should return 400 if password is too long', async () => {
    const res = await request(app).post('/api/check').send({ password: 'a'.repeat(129) });
    expect(res.statusCode).toBe(400);
  });

  it('should flag common password "password123"', async () => {
    const res = await request(app).post('/api/check').send({ password: 'password123' });
    expect(res.body.data.checks.notCommon).toBe(false);
  });

  it('should return checks object with all required fields', async () => {
    const res = await request(app).post('/api/check').send({ password: 'TestPass1!' });
    const checks = res.body.data.checks;
    expect(checks).toHaveProperty('minLength');
    expect(checks).toHaveProperty('hasUppercase');
    expect(checks).toHaveProperty('hasLowercase');
    expect(checks).toHaveProperty('hasNumbers');
    expect(checks).toHaveProperty('hasSymbols');
    expect(checks).toHaveProperty('notCommon');
  });

  it('should return crack time estimate', async () => {
    const res = await request(app).post('/api/check').send({ password: 'TestPass1!' });
    expect(res.body.data.crackTime).toBeDefined();
  });

  it('should return suggestions for weak password', async () => {
    const res = await request(app).post('/api/check').send({ password: 'abc' });
    expect(res.body.data.suggestions.length).toBeGreaterThan(0);
  });
});

describe('GET /api/health', () => {
  it('should return status ok', async () => {
    const res = await request(app).get('/api/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
  });
});
