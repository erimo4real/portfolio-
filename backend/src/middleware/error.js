export function errorHandler(err, req, res, next) {
  // Log the error for debugging
  console.error('Error:', err.message);
  console.error('Stack:', err.stack);
  
  const status = err.status || 500;
  const message = err.message || "Internal Server Error";
  
  res.status(status).json({ 
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
}
