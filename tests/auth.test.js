// tests/auth.test.js
const request = require('supertest');
const app = require('../app'); // Mengimpor aplikasi Express
const fs = require('fs');
const path = require('path');
const User = require('../models').User;

describe('Auth API Integration Tests', () => {
  let testUser;

  beforeAll(async () => {
    // Set up atau inisialisasi jika diperlukan
    testUser = {
      username: 'testuser',
      email: 'testuserx@example.com',
      password: 'Password123!',
      role: 'regUser',
    };
  });

  afterAll(async () => {
    // Clean up setelah semua pengujian selesai
    await User.destroy({ where: { email: testUser.email } });
  });

  it('should register a new user with a photo', async () => {
    const filePath = path.join(__dirname, 'uploads', 'DSCF1751.JPG'); // Ganti dengan path ke file foto yang valid
    const fileBuffer = fs.readFileSync(filePath); // Membaca file sebagai buffer

    // Siapkan body data yang akan dikirimkan dengan file sebagai buffer
    const body = {
      username: testUser.username,
      email: testUser.email,
      password: testUser.password,
      role: testUser.role,
      photo: fileBuffer, // Menambahkan file dalam bentuk buffer
    };

    // Kirim permintaan POST tanpa menggunakan form-data
    const response = await request(app)
      .post('/api/auth/register')
      .set('Content-Type', 'multipart/form-data')
      .field('username', testUser.username)
      .field('email', testUser.email)
      .field('password', testUser.password)
      .field('role', testUser.role)
      .attach('photo', filePath); // Lampirkan foto menggunakan metode .attach

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.username).toBe(testUser.username);
    expect(response.body.email).toBe(testUser.email);
    expect(response.body).toHaveProperty('photo');
    expect(response.body.photo).toContain('http'); // Foto harus menjadi URL lengkap
  });

  it('should not register a user with an existing email', async () => {
    // Mendaftarkan user pertama
    await request(app)
      .post('/api/auth/register')
      .send(testUser);

    // Coba daftar lagi dengan email yang sama
    const response = await request(app)
      .post('/api/auth/register')
      .send(testUser);

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty('message', 'Email has been registered');
  });

  it('should login with valid credentials', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({ email: testUser.email, password: testUser.password });

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('token');
  });

  it('should not login with invalid credentials', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({ email: testUser.email, password: 'wrongpassword' });

    expect(response.statusCode).toBe(401);
    expect(response.body).toHaveProperty('message', 'Invalid Credentials');
  });
});
