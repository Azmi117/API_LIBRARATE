const { ApiError } = require('../middlewares/errorMiddleware');
const { Review } = require('../models');

const getAllReview = async (params) => {
    const book_id = params;

    const reviews = await Review.findAll({
        where:{
            book_id
        }
    });

    if(!reviews) throw new ApiError(404, 'No Review Exist');

    return reviews;
}

const createReview = async (params) => {
    const {user_id, book_id, comment, rating} = params;

    const review = await Review.create({
        user_id,
        book_id,
        comment,
        rating
    });

    if(!review) throw new ApiError(400, 'Failed Create Review');

    return review;
}

const updateReview = async (params) => {
    const {id, comment, rating} = params;

    const review = await Review.update(
        {comment, rating},
        {
            where:{
                id
            }
        }
    );

    if(!review) throw new ApiError(400, 'Failed Update Review');

    const updated = await Review.findOne({
        where:{
            id
        }
    });

    return updated;
}

const deleteReview = async (params) => {
    const id = params;

    const del = await Review.destroy({
        where:{
            id
        }
    });

    if(!del) throw new ApiError(400, 'Failed Delete Review');

    return {message: 'Delete Success'};
}

module.exports = {
    getAllReview,
    createReview,
    updateReview,
    deleteReview
}