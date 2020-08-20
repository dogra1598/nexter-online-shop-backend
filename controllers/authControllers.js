const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");

const User = require("../models/user");
const HttpError = require("../models/httpError");

exports.postSignup = (req, res, next) => {
  const username = req.body.username;
  const email = req.body.email;
  const password = req.body.password;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError(errors.array()[0].msg, 422));
  }

  bcrypt
    .hash(password, 12)
    .then((hashedPassword) => {
      const user = new User({
        userName: username,
        email: email,
        password: hashedPassword,
        cart: { items: [] },
      });

      user.save();
      return res
        .status(201)
        .json({ message: "User added successfully.", error: false });
    })
    .catch(() => {
      throw new HttpError("Something went wrong.", 500);
    });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  let currUser;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError(errors.array()[0].msg, 422));
  }

  User.findOne({ email: email }).then((user) => {
    if (!user) {
      return next(
        new HttpError("Sorry User with this email does not exists.", 422)
      );
    }
    currUser = user;
    bcrypt
      .compare(password, user.password)
      .then((result) => {
        if (result) {
          let token;
          try {
            token = jwt.sign(
              { userId: currUser._id, email: currUser.email },
              process.env.JET_KEY,
              { expiresIn: "1h" }
            );
          } catch (error) {
            return next(new HttpError("Login failed.", 401));
          }

          return res.status(200).json({
            userId: currUser._id,
            email: currUser.email,
            token: token,
            error: false,
          });
        }
        return next(new HttpError("Sorry Password does not match.", 401));
      })
      .catch(() => {
        throw new HttpError("Something went wrong.", 500);
      });
  });
};
