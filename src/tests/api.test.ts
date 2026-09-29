import request from 'supertest';
import app from '../app';
import { connectDB, disconnectDB } from '../config/database';
import { runSeed } from '../seeds/seed';
import { User } from '../models/User';
import { Koottayma } from '../models/Koottayma';
import { Family } from '../models/Family';
import { AuditLog } from '../models/AuditLog';

describe('Catholic Forane Parish Management API Tests', () => {
  let superAdminToken: string;
  let adminToken: string;
  let leaderToken: string;
  let parishionerToken: string;
  let leaderKoottaymaId: string;
  let otherKoottaymaId: string;

  beforeAll(async () => {
    await connectDB();
    await runSeed();

    // Login Super Admin
    const saRes = await request(app).post('/api/v1/auth/login').send({
      loginIdentifier: '+919800000001',
      password: 'Password@123',
    });
    superAdminToken = saRes.body.data.accessToken;

    // Login Admin
    const admRes = await request(app).post('/api/v1/auth/login').send({
      loginIdentifier: '+919800000002',
      password: 'Password@123',
    });
    adminToken = admRes.body.data.accessToken;

    // Login Koottayma Leader
    const ldrRes = await request(app).post('/api/v1/auth/login').send({
      loginIdentifier: '+919800000003',
      password: 'Password@123',
    });
    leaderToken = ldrRes.body.data.accessToken;
    leaderKoottaymaId = ldrRes.body.data.user.assignedKoottayma._id;

    // Login Parishioner
    const parRes = await request(app).post('/api/v1/auth/login').send({
      loginIdentifier: '+919800000004',
      password: 'Password@123',
    });
    parishionerToken = parRes.body.data.accessToken;

    // Find another Koottayma
    const otherK = await Koottayma.findOne({ _id: { $ne: leaderKoottaymaId } });
    otherKoottaymaId = otherK!._id.toString();
  });

  afterAll(async () => {
    await disconnectDB();
  });

  describe('1. Health and Public Endpoints', () => {
    it('GET /api/health returns status online', async () => {
      const res = await request(app).get('/api/health');
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('online');
    });

    it('GET /api/v1/parish returns forane parish identity', async () => {
      const res = await request(app).get('/api/v1/parish');
      expect(res.status).toBe(200);
      expect(res.body.data.name).toBe("St. Mary's Forane Church");
      expect(res.body.data.patronSaint).toContain('Our Lady of Assumption');
    });
  });

  describe('2. Authentication & Security', () => {
    it('rejects invalid password', async () => {
      const res = await request(app).post('/api/v1/auth/login').send({
        loginIdentifier: '+919800000001',
        password: 'WrongPassword!',
      });
      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it('rejects unauthenticated request to protected endpoints', async () => {
      const res = await request(app).get('/api/v1/users');
      expect(res.status).toBe(401);
    });
  });

  describe('3. Parish Directory & Privacy Filter', () => {
    it('GET /api/v1/families returns primary directory fields', async () => {
      const res = await request(app)
        .get('/api/v1/families')
        .set('Authorization', `Bearer ${parishionerToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data).toBeInstanceOf(Array);
      expect(res.body.data.length).toBeGreaterThanOrEqual(10);

      const firstFamily = res.body.data[0];
      // Main directory primary fields verification
      expect(firstFamily).toHaveProperty('houseName');
      expect(firstFamily).toHaveProperty('headOfFamily');
      expect(firstFamily).toHaveProperty('koottaymaName');
      expect(firstFamily).toHaveProperty('phone1');
      expect(firstFamily).toHaveProperty('phone2');
    });

    it('masks private fields when viewed by unauthorized parishioner', async () => {
      // Find a family where phone or email is marked private
      const res = await request(app)
        .get('/api/v1/families?search=Thoppil')
        .set('Authorization', `Bearer ${parishionerToken}`);

      expect(res.status).toBe(200);
      const thoppil = res.body.data.find((f: any) => f.familyName === 'Thoppil');
      expect(thoppil).toBeDefined();
      // Email should be omitted or masked since privacy.isEmailVisible is false
      expect(thoppil.email).toBeUndefined();
    });

    it('returns full unmasked fields when viewed by Super Admin or Admin', async () => {
      const res = await request(app)
        .get('/api/v1/families?search=Thoppil')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      const thoppil = res.body.data.find((f: any) => f.familyName === 'Thoppil');
      expect(thoppil).toBeDefined();
      expect(thoppil.email).toBe('thoppildominic@outlook.com');
    });
  });

  describe('4. Koottayma Leader Ownership Boundaries', () => {
    it('allows Koottayma Leader to access their own Koottayma dashboard', async () => {
      const res = await request(app)
        .get(`/api/v1/koottaymas/dashboard/${leaderKoottaymaId}`)
        .set('Authorization', `Bearer ${leaderToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.koottayma._id).toBe(leaderKoottaymaId);
      expect(res.body.data.totalFamilies).toBeGreaterThan(0);
    });

    it('STRICTLY FORBIDS Koottayma Leader from accessing another unit', async () => {
      const res = await request(app)
        .get(`/api/v1/koottaymas/dashboard/${otherKoottaymaId}`)
        .set('Authorization', `Bearer ${leaderToken}`);

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('Access denied');
    });
  });

  describe('5. Granular RBAC Permissions', () => {
    it('prevents normal parishioner from creating a family record', async () => {
      const res = await request(app)
        .post('/api/v1/families')
        .set('Authorization', `Bearer ${parishionerToken}`)
        .send({
          houseName: 'Unauthorized House',
          familyName: 'Unauthorized',
          headOfFamily: 'John Doe',
          phone1: '+919999999999',
          address: 'Test Address',
          koottaymaId: leaderKoottaymaId,
        });

      expect(res.status).toBe(403);
    });

    it('allows Admin to create a family record', async () => {
      const res = await request(app)
        .post('/api/v1/families')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          houseName: 'Kalluvila House',
          familyName: 'Kalluvila',
          headOfFamily: 'Thomas Kalluvila',
          phone1: '+919847199999',
          phone2: '+919447199999',
          address: 'Kalluvila, Church Lane, Kadavanthra',
          koottaymaId: leaderKoottaymaId,
        });

      expect(res.status).toBe(201);
      expect(res.body.data.familyId).toBeDefined();
    });
  });

  describe('6. Mass & Prayer Meeting Schedules', () => {
    it('GET /api/v1/mass-schedules returns liturgical services', async () => {
      const res = await request(app).get('/api/v1/mass-schedules');
      expect(res.status).toBe(200);
      expect(res.body.data.length).toBeGreaterThan(0);
    });

    it('allows Koottayma Leader to schedule prayer meeting for their unit', async () => {
      const res = await request(app)
        .post('/api/v1/prayer-meetings')
        .set('Authorization', `Bearer ${leaderToken}`)
        .send({
          koottaymaId: leaderKoottaymaId,
          date: new Date(Date.now() + 5 * 24 * 3600 * 1000),
          time: '05:00 PM',
          venue: 'Alappatt House',
          hostFamily: 'Alappatt Family',
          leader: 'Baby John Pulivelil',
          theme: 'Unity in Prayer',
        });

      expect(res.status).toBe(201);
      expect(res.body.data.status).toBe('Scheduled');
    });
  });

  describe('7. Global Search', () => {
    it('searches across multiple collections and returns structured results', async () => {
      const res = await request(app)
        .get('/api/v1/search?q=Joseph')
        .set('Authorization', `Bearer ${parishionerToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data).toHaveProperty('families');
      expect(res.body.data).toHaveProperty('priests');
      expect(res.body.data).toHaveProperty('koottaymas');
    });
  });

  describe('8. Audit Logging & Super Admin Isolation', () => {
    it('forbids normal Admin from accessing Audit Logs', async () => {
      const res = await request(app)
        .get('/api/v1/audit-logs')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(403);
    });

    it('allows Super Admin to view Audit Logs', async () => {
      const res = await request(app)
        .get('/api/v1/audit-logs')
        .set('Authorization', `Bearer ${superAdminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data).toBeInstanceOf(Array);
      expect(res.body.data.length).toBeGreaterThan(0);
    });
  });
});
