import jwt from 'jsonwebtoken';

// Generate JWT
const generateToken = (userId, role) => {
  return jwt.sign(
    {
      user_id: userId,
      role: role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: '1h', // Token expiration
      algorithm: 'HS256',
    }
  );
};

// Verify Middleware
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ 
      error: 'Invalid token',
      details: err.message 
    });
  }
};

export default { generateToken, verifyToken };