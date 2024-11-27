const bookServices = require('../services/bookServices');

const getAllBooks = async (req, res, next) => {
    try{
        const {limit, page} = req.query;
        
        const baseUrl = `${req.protocol}://${req.get('host')}`;

        const params = {
            limit: parseInt(limit) || 10,
            offset: (parseInt(page) - 1) * (parseInt(limit) || 10) || 0,
            baseUrl
        }

        const books = await bookServices.getAllBook(params);
        res.status(200).json(books);

    }catch(error){
        next(error);
    }
}

const getBookById = async (req, res, next) => {
    try{

        const params = {
            id: req.params.id,
            baseUrl: `${req.protocol}://${req.get('host')}`
        }

        const book = await bookServices.getBookById(params);
        res.status(200).json(book);

    }catch(error){
        next(error);
    }
}

const createBook = async (req, res, next) => {
    try{

        const params = {
            ...req.body,
            id: req.user.id,
            photo: req.file ? req.file.path.replace(/\\/g, '/') : null
        }

        const book = await bookServices.createBook(params);

        book.photo = `${req.protocol}://${req.get('host')}/${book.photo}`;

        res.status(201).json(book);

    }catch(error){
        next(error);
    }
}

const updateBook = async (req, res, next) => {
    try{
        const params = {
            ...req.body,
            id: req.params.id,
            photo: req.file ? req.file.path.replace(/\\/g, '/') : null
        }

        const book = await bookServices.updateBook(params);

        book.photo = `${req.protocol}://${req.get('host')}/${book.photo}`;

        res.status(200).json(book);

    }catch(error){
        next(error);
    }
}

const deleteBook = async (req, res, next) => {
    try{

        await bookServices.deleteBook(req.params.id);
        res.status(204).send();

    }catch(error){
        next(error);
    }
}

module.exports = {
    getAllBooks,
    getBookById,
    createBook,
    updateBook,
    deleteBook
}