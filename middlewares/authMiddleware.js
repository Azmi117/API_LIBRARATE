const jwt = require('jsonwebtoken');

const authenticate = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if(!token) return res.status(401).json({ error: 'No token provided'});

    jwt.verify(token, process.env.JWT_SECRET, (err, decode) => {
        if(err){
            return res.status(403).json('Failed authenticate token');
        }
        req.user = decode;
        next();
    });
};

const authorize = () => {
    return(req, res, next) => {
        if(req.user.role !== 'Admin'){
            return res.status(403).json({error: 'Access Denied'});
        }
        next();
    }
}

module.exports = {
    authenticate,
    authorize
}