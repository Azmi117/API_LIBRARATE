const { User } = require('../models');
const {Op} = require('sequelize');
const {ApiError} = require('../middlewares/errorMiddleware');

const getAllUsers = async (params) => {
    const {username, limit, offset, baseUrl} = params;

    const queryOptions = {
        limit: limit || 9,
        offset: offset || 0
    }

    if(username){
        queryOptions.where = {
            ...queryOptions.where,
            username: {
                [Op.iLike]: `%${username}%`
            }
        };
    }

    const users = await User.findAndCountAll({
        where:{
            role: 'regUser',
            ...queryOptions.where,
        },
        limit:queryOptions.limit,
        offset:queryOptions.offset,
    });

    if(!users) throw new ApiError(404, 'No users exist');

    const newUsers = users.rows.map(user => {
        user.photo = `${baseUrl}/${user.photo}`;
        return user;
    });

    return {
        totalUser : users.count,
        users : newUsers,
        totalPages : Math.ceil(users.count / (limit || 10)),
        currentPages : Math.floor((offset || 0) / (limit || 10)) + 1
    }
};

const getUserById = async (params) => {
    const {id, baseUrl} = params;

    const user = await User.findOne({
        where:{
            id
        }
    });

    if(!user) throw new ApiError(404, 'User not found');

    user.photo = `${baseUrl}/${user.photo}`;

    return user;
}

const updateUser = async (params) => {
    const {id, username, email, photo} = params;

    const update = await User.update(
        {username, email, photo},
        {
            where:{
                id
            }
        }
    );

    if(!update) throw new ApiError(404, 'User Not Found');

    const user = await User.findOne({
        where:{
            id
        }
    });

    return user;
}

const deleteUser = async (params) => {
    const id = params;

    const del = await User.destroy({
        where:{
            id
        }
    });

    if(!del) throw new ApiError(404, 'User Not Found');

    return{message: 'Delete user success'};

}

module.exports = {
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser
};
