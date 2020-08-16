const fs = require("fs");

const { validationResult } = require("express-validator/check");

const Product = require("../models/product");
const User = require("../models/user");

exports.postAddProduct = (req, res, next) => {
  const { title, price, description, userId } = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError(errors.array()[0].msg, 422));
  }

  const product = new Product({
    title: title,
    imageUrl: req.file.path,
    price: price,
    description: description,
    userId: userId,
  });

  product
    .save()
    .then(() => {
      return res
        .status(201)
        .json({ message: "Product added successfully.", error: false });
    })
    .catch(() => {
      throw new HttpError("Something went wrong.", 500);
    });
};

exports.getAdminProducts = (req, res, next) => {
  const userId = req.params.userId;

  Product.find({ userId: userId })
    .then((products) => {
      res.status(200).json({ products: products });
    })
    .catch(() => {
      throw new HttpError("Something went wrong.", 500);
    });
};

exports.getEditProduct = (req, res, next) => {
  const productId = req.params.productId;

  Product.findById({ _id: productId })
    .then((product) => {
      res.status(200).json({ product: product, error: false });
    })
    .catch(() => {
      throw new HttpError("Something went wrong.", 500);
    });
};

exports.patchEditProduct = (req, res, next) => {
  const { productId, title, price, description, userId } = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError(errors.array()[0].msg, 422));
  }

  Product.findById(productId)
    .then((product) => {
      if (product.userId.toString() !== userId.toString()) {
        return res
          .status(404)
          .json({ message: "Sorry can't update the product.", error: true });
      }
      product.title = title;
      product.price = price;
      product.description = description;
      const imagePath = product.imageUrl;
      fs.unlink(imagePath, (err) => {});
      product.imageUrl = req.file.path;

      return product.save();
    })
    .then(() => {
      return res
        .status(201)
        .json({ message: "Product updated successfully.", error: false });
    })
    .catch(() => {
      throw new HttpError("Something went wrong.", 500);
    });
};

exports.postDeleteProduct = (req, res, next) => {
  const productId = req.params.productId;
  let imagePath;

  Product.findById({ _id: productId })
    .then((product) => {
      if (!product) {
        return next(new HttpError("No products found.", 422));
      }
      imagePath = product.imageUrl;
      return Product.deleteOne({ _id: productId });
    })
    .then(() => {
      return User.find().then((users) => {
        users.forEach((user) => {
          user.deleteFromCart(productId);
        });
      });
    })
    .then(() => {
      fs.unlink(imagePath, (err) => {});
      return res
        .status(200)
        .json({ message: "Product delete successfully", error: false });
    })
    .catch(() => {
      throw new HttpError("Something went wrong.", 500);
    });
};
