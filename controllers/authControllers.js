const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");

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

    bcrypt
      .compare(password, user.password)
      .then((result) => {
        if (result) {
          return res
            .status(200)
            .json({ user: user.toObject({ getters: true }), error: false });
        }
        return next(new HttpError("Sorry Password does not match.", 401));
      })
      .catch(() => {
        throw new HttpError("Something went wrong.", 500);
      });
  });
};
