// src/utils/generateToken.js
import jwt from 'jsonwebtoken';

const generateToken = (id) => {
  // Use the secret key defined in your .env file
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d', // Token expires in 30 days
  });
};

export default generateToken;