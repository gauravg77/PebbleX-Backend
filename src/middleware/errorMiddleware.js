// src/middleware/errorMiddleware.js

// 1. Catches requests made to invalid routes (404 Not Found)
const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error); // Passes the error to the errorHandler below
};

// 2. The main error handling function
const errorHandler = (err, req, res, next) => {
  // Sometimes Express errors can have status 200, so we check and set it to 500
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);

  res.json({
    message: err.message,
    // Only send the stack trace in development mode for debugging
    stack: process.env.NODE_ENV === 'production' ? null : err.stack, 
  });
};

module.exports = { notFound, errorHandler };