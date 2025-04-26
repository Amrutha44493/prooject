const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  // Check for token in both x-auth-token and Authorization headers
  const token = req.header('x-auth-token') || req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  // Verify token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.student = decoded.student;
    next();
  } catch (err) {
    console.error('Token verification error:', err);
    res.status(401).json({ msg: 'Token is not valid' });
  }
};