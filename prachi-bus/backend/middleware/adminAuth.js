const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = async function (req, res, next) {
    const token = req.header('x-auth-token');
    if (!token) return res.status(401).json({ message: 'No token, authorization denied' });
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select('-password');
        if (!user || user.role !== 'admin')
            return res.status(403).json({ message: 'Access denied. Admins only.' });
        req.user = decoded;
        next();
    } catch {
        res.status(401).json({ message: 'Token is not valid' });
    }
};
