const jwt = require('jsonwebtoken');

const  authenticateUser=(req, res, next) =>{
  const authHeader = req.headers['authorization'];
  
  if (!authHeader) return res.status(401).json({ message: 'No token provided' });
  const token = authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Invalid token format' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = { id: decoded.id };
    next();
  } catch (err) {
    console.error('JWT verification failed:', err);
    return res.status(403).json({ message: 'Failed to authenticate token' });
  }
}
module.exports = authenticateUser;

