const { Book, User } = require('../models');
const {Op} = require('sequelize');
const {ApiError} = require('../middlewares/errorMiddleware');

const getAllBook = async (params) => {
    const {limit, offset, baseUrl, title, genre} = params;

    const queryOptions = {
        limit: limit || 10,
        offset: offset || 0
    }

    if(genre){
        queryOptions.where = {genre};
    }

    if(title){
        queryOptions.where = {
            ...queryOptions.where,
            title: {
                [Op.iLike]: `%${title}%`
            }
        };
    }

    const books = await Book.findAndCountAll(queryOptions);
    if(!books) throw new ApiError(404, 'No Books Exist');

    const newBooks = books.rows.map(book => {
        book.photo = `${baseUrl}/${book.photo}`;
        return book;
    });

    return{
        totalBooks: books.count,
        books: newBooks,
        totalPages: Math.ceil(books.count / (limit || 10)),
        currentPages: Math.floor((offset || 0) / (limit || 10)) + 1
    }
}

const getBookById = async (params) => {
    const {id, baseUrl} = params;

    const book = await Book.findOne({
        where:{
            id
        }
    });

    if(!book) throw new ApiError(404, 'Book not found');

    book.photo = `${baseUrl}/${book.photo}`;

    return book;
}

const createBook = async (params) => {
    const {id, title, genre, author, pages, sinopsis, photo} = params;

    const user = await User.findOne({
        where:{
            id
        }
    });

    const book = await Book.create({
        title,
        genre,
        author,
        pages,
        sinopsis,
        photo,
        upload_by: user.username
    });

    if(!book) throw new ApiError(400, 'Failed to create book');

    return book;
}

const updateBook = async (params) => {
    const {id, title, genre, author, pages, sinopsis, photo, upload_by} = params;

    const updateBook = await Book.update(
        {title, genre, author, pages, sinopsis, photo, upload_by},
        {
            where:{
                id
            }
        }
        );

    if(!updateBook) throw new ApiError(404, 'Book Not Found');

    const book = await Book.findOne({
        where:{
            id
        }
    });

    return book;
}

const deleteBook = async (params) =>{
    const id = params;

    const del = await Book.destroy({
        where:{
            id
        }
    });

    if(!del) throw new ApiError(400, 'Delete Book Failed');

    return{message: 'Delete Success'};
}

module.exports = {
    getAllBook,
    getBookById,
    createBook,
    updateBook,
    deleteBook
}