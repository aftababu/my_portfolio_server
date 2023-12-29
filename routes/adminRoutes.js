const express = require("express");
const expressAsyncHandler = require("express-async-handler");
const ErrorHandler = require("../utils/errorHandler");

const router = express.Router();

router.route("/onlyadmincanaccess").post(expressAsyncHandler(async (req, res, next) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return next(new ErrorHandler("Please enter email and password", 400));
      }
      if (
        email === process.env.ADMINEMAIL &&
        password === process.env.ADMINPASSWORD
      ) {
     res.json({
          success: true,
          password: password,
        });
      } else {
        return next(
          new ErrorHandler("Only Mohammad Abu Aftab Wasih is allowed", 400)
        );
      }
    } catch (error) {
      return next(new ErrorHandler("Internal Server Error", 500));
    }
  })
);

module.exports = router;
