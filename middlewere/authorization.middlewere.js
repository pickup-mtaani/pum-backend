var jsonwebtoken = require('jsonwebtoken');

const authorized = (req, res, next) => {

    const loginRequired = req.user;

    if (loginRequired === null) {

        return res.status(401).json({ message: 'Unauthorized user !' });

    }

    next();

}

const authMiddleware = (req, res, next) => {

    const authorization = req.headers['authorization'];

    const token = authorization && authorization.split(' ')[1];

    if(token == null) {

        return res.status(401).json({ success: false, message: 'Not Authorised !' });

    }

    jsonwebtoken.verify(token, 'Bradley', async (err, data) => {

        if (err) {
            console.log(error)
            return res.status(403).json({ success: false, message: 'Not Authorised !' });
        }

        req.user = data;

        next();

    });

}

module.exports = { authMiddleware, authorized };