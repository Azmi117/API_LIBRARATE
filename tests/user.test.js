const request = require('supertest');
const app = require('../app');
const { User } = require('../models');
const authService = require('../services/authServices');
const bcrypt = require('bcrypt');
const path = require('path');

describe('User API Integration Tests', () => {
  let token, testUser;

  beforeAll(async () => {
    // Hash password sebelum menyimpan user ke database
    const hashedPassword = await bcrypt.hash('Password123!', 10);

    // Buat user untuk testing
    testUser = await User.create({
      username: 'testuser',
      email: 'testuserz@example.com',
      password: hashedPassword,  // Simpan password yang sudah di-hash
      role: 'regUser',
    });

    // Dapatkan token autentikasi melalui layanan login
    const { token: userToken } = await authService.login({
      email: testUser.email,
      password: 'Password123!' // Password yang sesuai untuk login
    });

    token = userToken; // Simpan token untuk digunakan dalam request API berikutnya
  });

  afterAll(async () => {
    // Hapus user setelah tes selesai
    await User.destroy({ where: { email: testUser.email } });
  });

  it('should fetch all users', async () => {
    const response = await request(app)
      .get('/api/user')
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('totalUser');
    expect(response.body.users.length).toBeGreaterThan(0);
  });

  it('should fetch a single user by ID', async () => {
    const response = await request(app)
      .get(`/api/user/${testUser.id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('id', testUser.id);
  });

  it('should update a user', async () => {
    const photoPath = path.join(__dirname, 'uploads', 'DSCF1751.JPG');
  
    const response = await request(app)
      .put(`/api/user/update/${testUser.id}`)
      .set('Authorization', `Bearer ${token}`)
      .field('username', 'updatedUser')
      .field('email', 'updateduser@example.com')
      .attach('photo', photoPath);  // Attach file photo
  
    expect(response.statusCode).toBe(200);
    expect(response.body.username).toBe('updatedUser');
    expect(response.body.email).toBe('updateduser@example.com');
    expect(response.body.photo).toContain('DSCF1751.JPG');
  });

  it('should delete a user', async () => {
    const response = await request(app)
      .delete(`/api/user/delete/${testUser.id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(204); // 204 berarti sukses tanpa konten
  });
});
