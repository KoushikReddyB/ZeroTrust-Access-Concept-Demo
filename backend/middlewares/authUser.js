const jwt = require('jsonwebtoken');

const authenticateUser = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');  // Assuming the token is passed in the header

  if (!token) {
    return res.status(401).json({ message: 'Access denied, token missing' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);  // Replace with your secret key
    if (decoded.role !== 'user' && decoded.role !== 'admin') {  // Allow 'admin' and 'user' roles to access
      return res.status(403).json({ message: 'Access denied, not a user' });
    }
    req.user = decoded;  // Attach user info to request object if needed
    next();  // Proceed to the next middleware or route handler
  } catch (error) {
    return res.status(400).json({ message: 'Invalid token' });
  }
};

module.exports = { authenticateUser };
