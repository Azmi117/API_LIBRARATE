const bookServices = require('../services/bookServices');

const getAllBooks = async (req, res, next) => {
    try{
        const {genre, title, country, limit, page} = req.query;
        const parsedLimit = parseInt(limit, 10) || 10; // Default to 10 if NaN
        const parsedPage = parseInt(page, 10) || 1;
        
        
        const params = {
            genre,
            title,
            country,
            limit: parsedLimit,
            offset: (parsedPage - 1) * parsedLimit
        };
        
        const baseUrl = `${req.protocol}://${req.get('host')}`;
        const bookData = await bookServices.getAllBook(params, baseUrl);
        
        res.status(200).json(bookData);

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