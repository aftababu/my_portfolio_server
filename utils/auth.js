const expressAsyncHandler = require("express-async-handler");
const ErrorHandler = require("./errorHandler");

exports.isAuthencateUser = expressAsyncHandler(async (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return next(new ErrorHandler("Please login to access this resource", 401));
  }
  if (token === process.env.ADMINPASSWORD) {
    next();
  } else {
    return next(new ErrorHandler("Please login to access this resource", 401));
  }
  // Validate the token and perform authentication logic here
  // You might use a library like jsonwebtoken to verify the token
});
