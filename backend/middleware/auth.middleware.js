import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'lifeos_super_secret_jwt_key_2026_demo';

export function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, message: 'Access denied. No token provided.' });
  }

  // Handle Special Demo Mode Token
  if (token === 'demo-token-123') {
    req.user = { id: 'demo-user-123', email: 'demo@lifeos.ai', name: 'Mohammed' };
    req.userId = 'demo-user-123';
    return next();
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    req.userId = decoded.id || decoded.userId;
    next();
  } catch (error) {
    return res.status(403).json({ success: false, message: 'Invalid or expired token.' });
  }
}
