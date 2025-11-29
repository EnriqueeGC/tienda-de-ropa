const { ApiError } = require("./ApiError.js");

const errorHandler = (error, req, res, next) => {
  console.error("Error occurred:", error);

  if (error instanceof ApiError) {
    return res.status(error.statusCode).json({
      success: false,
      message: error.message,
    });
  }

  if (error.name === "SequelizeUniqueConstraintError") {
    return res.status(409).json({
      success: false,
      message: "Resource alredy exists",
      field: error.errors[0]?.path,
    });
  }

  if (error.name === "SequelizeValidationError") {
    return res.status(400).json({
      success: false,
      message: "Database validation failed",
      errors: error.errors.map((err) => ({
        field: err.path,
        message: err.message,
      })),
    });
  }

  // Internal server error
  res.status(500).json({
    success: false,
    message:
      process.env.NODE_ENV === "production"
        ? "Internal server error"
        : error.message,
  });
};

module.exports = errorHandler; // Export the error handler middleware for use in the application
