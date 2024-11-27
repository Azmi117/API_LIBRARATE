const reviewService = require('../services/reviewServices');

const getAllReview = async (req, res, next) => {
    try{
        const review = await reviewService.getAllReview(req.params.id);
        res.status(200).json(review);
    }catch(error){
        next(error);
    }
}

const createReview = async (req, res, next) => {
    try{
        const params = {
            ...req.body,
            user_id:req.user.id,
            book_id:req.params.id
        }
        const review = await reviewService.createReview(params);
        res.status(201).json(review);

    }catch(error){
        next(error)
    }
}

const updateReview = async (req, res, next) => {
    try{
        const params = {
            id:req.params.id,
            ...req.body
        }

        const update = await reviewService.updateReview(params);
        res.status(200).json(update);

    }catch(error){
        next(error);
    }
}

const deleteReview = async (req, res, next) => {
    try{
        await reviewService.deleteReview(req.params.id);
        res.status(204).send();
        
    }catch(error){
        next(error)
    }
}

module.exports = {
    getAllReview,
    createReview,
    updateReview,
    deleteReview
}