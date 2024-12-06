const request = require('supertest');
const app = require('../app'); // Sesuaikan dengan path ke app express
const { Book, User } = require('../models');
const fs = require('fs'); // Untuk mengakses file (digunakan jika Anda menguji upload foto)
const path = require('path');
const authService = require('../services/authServices'); // Untuk login dan mendapatkan token autentikasi
const bcrypt = require('bcrypt');


describe('Book API Integration Tests', () => {
  let token, testUser, testBook;

  beforeAll(async () => {
    // Buat user untuk testing
    const hashedPassword = await bcrypt.hash('Password123!', 10);

    testUser = await User.create({
      username: 'testuser',
      email: 'testuserx@example.com',
      password: hashedPassword,
      role: 'regUser',
    });

    // Dapatkan token autentikasi
    const { token: userToken } = await authService.login({
      email: testUser.email,
      password: 'Password123!'
    });

    token = userToken;
  });

  afterAll(async () => {
    // Hapus data setelah tes selesai
    await Book.destroy({ where: { title: 'Test Book' } });
    await User.destroy({ where: { email: 'testuserx@example.com' } });
  });

  it('should create a new book', async () => {
    const photoPath = path.join(__dirname, 'uploads', 'DSCF1751.JPG'); //(Ini yang membuat error)
    console.log(photoPath);

    const response = await request(app)
      .post('/api/book/create')
      .set('Authorization', `Bearer ${token}`)
      .field('title', 'Test Book')
      .field('genre', 'Fantasy')
      .field('author', 'Test Author')
      .field('pages', 300)
      .field('sinopsis', 'Test sinopsis')
      .field('country', 'Test country')
      .attach('photo', photoPath) // (ini yang membuat error)
      .field('image_3d', 'Test image_3d')
      .field('image_Title', 'Test image_Title');

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.title).toBe('Test Book');
    testBook = response.body; // Simpan untuk tes selanjutnya
  });

  it('should fetch all books', async () => {
    const response = await request(app)
      .get('/api/book')
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.totalBooks).toBeGreaterThan(0);
    expect(response.body.books.length).toBeGreaterThan(0);
  });

  it('should fetch a single book by ID', async () => {
    const response = await request(app)
      .get(`/api/book/${testBook.id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('id', testBook.id);
  });

  it('should update a book', async () => {
    const photoPath = path.join(__dirname, 'uploads', 'DSCF1751.JPG');

    const response = await request(app)
      .put(`/api/book/update/${testBook.id}`)
      .set('Authorization', `Bearer ${token}`)
      .field('title', 'bookTest')
      .field('genre', 'comedy')
      .field('author', 'testUser')
      .field('pages', 'test100')
      .field('sinopsis', 'testSinopsis')
      .field('country', 'testCountry')
      .field('image_3d', 'testImage_3d')
      .field('image_Title', 'testImage_Title')
      .attach('photo', photoPath);

    expect(response.statusCode).toBe(200);
    expect(response.body.title).toBe('bookTest');
    expect(response.body.genre).toBe('comedy');
    expect(response.body.author).toBe('testUser');
    expect(response.body.pages).toBe('test100');
    expect(response.body.sinopsis).toBe('testSinopsis');
    expect(response.body.country).toBe('testCountry');
    expect(response.body.image_3d).toBe('testImage_3d');
    expect(response.body.image_Title).toBe('testImage_Title');
    expect(response.body.photo).toContain('DSCF1751.JPG');
  });

  it('should delete a book', async () => {
    const response = await request(app)
      .delete(`/api/book/delete/${testBook.id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(204);
  });
});
