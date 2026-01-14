import jwt from 'jsonwebtoken';
import UserModel from '../models/user.js';

export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await UserModel.findById(decoded.id).select('-password');

      if (!req.user) {
        console.log('User not found in database');
        return res.status(404).json({ message: 'User not found' });
      }

      console.log('User authenticated:', req.user);
      next();
    } catch (error) {
      console.log('JWT verification failed:', error.message);
      res.status(401).json({ message: 'Not authorized to access this route' });
    }
  } else {
    console.log('No token provided');
    res.status(401).json({ message: 'No token provided' });
  }
};
