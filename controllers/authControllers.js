const bcrypt = require("bcryptjs");

const User = require("../models/user");
const HttpError = require("../models/httpError");

exports.postSignup = (req, res, next) => {
  const username = req.body.username.value;
  const email = req.body.email.value;
  const password = req.body.password.value;

  User.findOne({ email: email })
    .then((user) => {
      if (user) {
        return next(new HttpError("User already exists", 422));
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
          return res.status(201).json({ message: "User added" });
        })
        .catch(() => {
          throw new HttpError("Something went wrong", 500);
        });
    })
    .catch((err) => {
      throw new HttpError("Something went wrong", 500);
    });
};
