const userServices = require('../services/userServices');

const getAllUser = async (req, res, next) => {
    try{
        const {username, limit, page} = req.query;
        const offset = (page - 1) * (limit || 10);
        const baseUrl = `${req.protocol}://${req.get('host')}`;

        const users = await userServices.getAllUsers({
            username, // Teruskan username ke service
            limit: Number(limit),
            offset: Number(offset),
            baseUrl,   
        });
        res.status(200).json(users);

    }catch(error){
        next(error);
    }
};

const getUserById = async (req, res, next) => {
    try{

        const params = {
            id:req.params.id,
            baseUrl:`${req.protocol}://${req.get('host')}`
        }

        const user = await userServices.getUserById(params);
        res.status(200).json(user);

    }catch(error){
        next(error);
    }
}

const getOneUser = async (req, res, next) => {
    try{

        const params = {
            id:req.user.id,
            baseUrl:`${req.protocol}://${req.get('host')}`
        }

        const user = await userServices.getUserById(params);
        res.status(200).json(user);

    }catch(error){
        next(error);
    }
}

const updateUser = async (req, res, next) => {
    try{
        const params = {
            id: req.user.id,
            photo: req.file ? req.file.path.replace(/\\/g, '/') : null,
            ...req.body
        }

        const user = await userServices.updateUser(params);

        user.photo = `${req.protocol}://${req.get('host')}/${user.photo}`;

        res.status(200).json(user);

    }catch(error){
        next(error);
    }
}

const deleteUser = async (req, res, next) => {
    try{
        await userServices.deleteUser(req.params.id);
        res.status(204).send();
    }catch(error){
        next(error);
    }
}

module.exports = {
    getAllUser,
    getUserById,
    getOneUser,
    updateUser,
    deleteUser
}
