const {User} = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { ApiError } = require('../middlewares/errorMiddleware');

const register = async (params) => {
    const {username, email, password, role, photo} = params;

    const findUser = await User.findOne({
        where:{
            email
        }
    });

    if(findUser) throw new ApiError(400, 'Email has been registered');

    const hashedPassword = await bcrypt.hash(password, 10);

    const regis = await User.create({
        username,
        email,
        password: hashedPassword,
        role: 'regUser',
        photo
    });

    if(!regis) throw new ApiError(500, 'Register Failed');

    return regis;
}

const login = async (params) => {
    const {email, password} = params;

    const user = await User.findOne({
        where:{
            email
        }
    });

    if(!user) throw new ApiError(404, 'User Not Found');

    const valid = await bcrypt.compare(password, user.password);
    if(!valid) throw new ApiError(401, 'Invalid Credentials');

    const token = jwt.sign({
        id:user.id,
    }, process.env.JWT_SECRET, {expiresIn: '1h'});

    return {token};
}

module.exports = {
    register,
    login
}