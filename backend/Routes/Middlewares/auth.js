const jwt = require('jsonwebtoken');

const ensureAuthenticated = (req, res, next) => {
    const auth = req.headers['authorization'];
    if (!auth || !auth.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized. JWT Token required' });
    }
    const token = auth.split(' ')[1]; 
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized. Invalid token format' });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Unauthorized. JWT Token invalid or expired' });
    }
};

module.exports = ensureAuthenticated;