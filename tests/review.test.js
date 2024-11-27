const request = require('supertest');
const app = require('../app');
const { Review, User, Book } = require('../models');
const authService = require('../services/authServices');
const bcrypt = require('bcrypt');

describe('Review API Integration Tests', () => {
  let token, testUser, testBook, testReview;

  beforeAll(async () => {
    // Buat user untuk testing
    const hashedPassword = await bcrypt.hash('Password123!', 10);

    testUser = await User.create({
      username: 'testuser',
      email: 'testuser@example.com',
      password: hashedPassword,
      role: 'regUser',
    });

    // Buat buku untuk testing
    testBook = await Book.create({
      title: 'Test Book',
      genre: 'Fantasy',
      author: 'Test Author',
      pages: 300,
      sinopsis: 'This is a test book',
    });

    // Dapatkan token autentikasi
    const { token: userToken } = await authService.login({
      email: testUser.email,
      password: 'Password123!',
    });

    token = userToken;
  });
  
  afterAll(async () => {
      // Hapus data setelah tes selesai
      await Review.destroy({ where: { book_id: testBook.id } });
      await Book.destroy({ where: { id: testBook.id } });
      await User.destroy({ where: { email: 'testuser@example.com' } });
    });
    
    it('should create a new review', async () => {
      const response = await request(app)
        .post(`/api/review/create/${testBook.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          comment: 'Great book!',
          rating: 5,
        });
  
      expect(response.statusCode).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.comment).toBe('Great book!');
      expect(Number(response.body.rating)).toBe(5);
      testReview = response.body; // Simpan untuk tes berikutnya
    });

    it('should fetch all reviews for a book', async () => {
        // Gunakan testBook.id yang sudah dibuat di setup
        const bookId = testBook.id;
    
        const response = await request(app)
          .get(`/api/review/${bookId}`)  // Ganti bookId dengan testBook.id
          .set('Authorization', `Bearer ${token}`);
    
        expect(response.statusCode).toBe(200);
        expect(response.body.length).toBeGreaterThan(0);
        expect(response.body[0]).toHaveProperty('id');
        expect(response.body[0].comment).toBe('Great book!');
    });
    

  it('should update a review', async () => {
    const response = await request(app)
      .put(`/api/review/update/${testReview.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        comment: 'Updated comment',
        rating: 4,
      });

    expect(response.statusCode).toBe(200);
    expect(response.body.comment).toBe('Updated comment');
    expect(Number(response.body.rating)).toBe(4);
  });

  it('should delete a review', async () => {
    const response = await request(app)
      .delete(`/api/review/delete/${testReview.id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(204);

    // Verifikasi bahwa review sudah dihapus
    const deletedReview = await Review.findByPk(testReview.id);
    expect(deletedReview).toBeNull();
  });
});
