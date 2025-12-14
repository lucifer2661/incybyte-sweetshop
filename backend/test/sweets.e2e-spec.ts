import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import * as bcrypt from 'bcryptjs';

describe('SweetsController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let accessToken: string;
  let adminToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();

    prisma = moduleFixture.get<PrismaService>(PrismaService);
    await prisma.sweet.deleteMany();
    await prisma.user.deleteMany();

    // Create test user
    const user = await prisma.user.create({
      data: {
        email: 'user@test.com',
        passwordHash: await bcrypt.hash('password123', 10),
        role: 'USER',
      },
    });

    // Create admin user
    const admin = await prisma.user.create({
      data: {
        email: 'admin@test.com',
        passwordHash: await bcrypt.hash('password123', 10),
        role: 'ADMIN',
      },
    });

    // Login to get tokens
    const userLogin = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({
        email: 'user@test.com',
        password: 'password123',
      });

    const adminLogin = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({
        email: 'admin@test.com',
        password: 'password123',
      });

    accessToken = userLogin.body.access_token;
    adminToken = adminLogin.body.access_token;
  });

  afterAll(async () => {
    await prisma.sweet.deleteMany();
    await prisma.user.deleteMany();
    await app.close();
  });

  describe('/api/sweets (POST)', () => {
    it('should create a sweet with valid token', () => {
      return request(app.getHttpServer())
        .post('/api/sweets')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          name: 'Chocolate Bar',
          category: 'Chocolate',
          price: 5.99,
          quantity: 10,
        })
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body.name).toBe('Chocolate Bar');
          expect(res.body.price).toBe(5.99);
        });
    });

    it('should reject request without token', () => {
      return request(app.getHttpServer())
        .post('/api/sweets')
        .send({
          name: 'Chocolate Bar',
          category: 'Chocolate',
          price: 5.99,
          quantity: 10,
        })
        .expect(401);
    });
  });

  describe('/api/sweets (GET)', () => {
    it('should return all sweets', () => {
      return request(app.getHttpServer())
        .get('/api/sweets')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
        });
    });
  });

  describe('/api/sweets/search (GET)', () => {
    it('should search sweets by name', async () => {
      await request(app.getHttpServer())
        .post('/api/sweets')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          name: 'Candy',
          category: 'Hard Candy',
          price: 2.99,
          quantity: 20,
        });

      return request(app.getHttpServer())
        .get('/api/sweets/search?name=Candy')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          expect(res.body.length).toBeGreaterThan(0);
        });
    });
  });

  describe('/api/sweets/:id (DELETE)', () => {
    it('should allow ADMIN to delete sweet', async () => {
      const createResponse = await request(app.getHttpServer())
        .post('/api/sweets')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          name: 'To Delete',
          category: 'Test',
          price: 1.99,
          quantity: 5,
        });

      return request(app.getHttpServer())
        .delete(`/api/sweets/${createResponse.body.id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);
    });

    it('should reject USER from deleting sweet', async () => {
      const createResponse = await request(app.getHttpServer())
        .post('/api/sweets')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          name: 'To Delete 2',
          category: 'Test',
          price: 1.99,
          quantity: 5,
        });

      return request(app.getHttpServer())
        .delete(`/api/sweets/${createResponse.body.id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(403);
    });
  });
});

