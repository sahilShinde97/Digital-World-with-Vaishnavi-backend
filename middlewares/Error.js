export const ErrorMiddleware = (err, req, res, next) => {
  err.message = err.message || "Internal Server Error";
  err.statusCode = err.statusCode || 500;

  // Log error for debugging
  console.error("Error:", err);

  // Handle specific error types
  if (err.name === "CastError") {
    err.message = "Invalid ID format";
    err.statusCode = 400;
  }

  if (err.code === 11000) {
    err.message = "Duplicate field value entered";
    err.statusCode = 400;
  }

  if (err.name === "ValidationError") {
    err.message = Object.values(err.errors).map(val => val.message).join(", ");
    err.statusCode = 400;
  }

  // Send error response
  res.status(err.statusCode).json({
    success: false,
    message: err.message,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined
  });
}; 