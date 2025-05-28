// const jwt = require('jsonwebtoken');

// const verifyAdmin = (req, res, next) => {
//   try {
//     const authHeader = req.headers.authorization;
//     if (!authHeader || !authHeader.startsWith('Bearer ')) {
//       return res.status(401).json({ message: 'Unauthorized' });
//     }

//     const token = authHeader.split(' ')[1];
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);

//     if (!decoded.isAdmin) {
//       return res.status(403).json({ message: 'Access denied: Admins only' });
//     }

//     req.user = decoded;
//     next();
//   } catch (error) {
//     return res.status(401).json({ message: 'Invalid token' });
//   }
// };

// module.exports = verifyAdmin;
