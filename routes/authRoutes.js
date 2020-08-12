const express = require("express");
const { body } = require("express-validator");

const User = require("../models/user");

const router = express.Router();

const authControllers = require("../controllers/authControllers");

router.post(
  "/signup",
  [
    body("confirmPassword").custom((value, { req }) => {
      if (value != req.body.password) {
        throw new Error("Password confirmation does not match password");
      }
      return true;
    }),
    body("email")
      .isEmail()
      .normalizeEmail()
      .withMessage("Please enter a valid Email.")
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then((userdoc) => {
          if (userdoc) {
            return Promise.reject(
              "User with this email already exists. Please pick a different one."
            );
          }
        });
      })
  ],
  authControllers.postSignup
);

router.post(
  "/login",
  [
    body("email")
      .isEmail()
      .normalizeEmail()
      .withMessage("Please enter a valid Email."),
  ],
  authControllers.postLogin
);

module.exports = router;
