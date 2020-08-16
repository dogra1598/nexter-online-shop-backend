const Product = require("../models/product");
const User = require("../models/user");
const HttpError = require("../models/httpError");
const Order = require("../models/order");

exports.getIndex = (req, res, next) => {
  Product.find()
    .then((products) => {
      if (!products) {
        return next(new HttpError("Sorry no products found.", 404));
      }
      return res.status(200).json({ products: products });
    })
    .catch(() => {
      throw new HttpError("Something went wrong", 500);
    });
};

exports.getProduct = (req, res, next) => {
  const productId = req.params.productId;
  Product.findOne({ _id: productId })
    .then((product) => {
      if (!product) {
        return next(new HttpError("Could not found product", 404));
      }
      return res.status(200).json({ product: product, notFound: false });
    })
    .catch(() => {
      throw new HttpError("Something went wrong", 500);
    });
};

exports.postCart = (req, res, next) => {
  const productId = req.body.productId;
  const userId = req.body.userId;

  Product.findById({ _id: productId })
    .then((product) => {
      User.findById(userId)
        .then((user) => {
          return user.addToCart(product);
        })
        .then(() => {
          return res.status(201).json({
            message: "Product successfully added to cart.",
            error: false,
          });
        })
        .catch(() => {
          return next(new HttpError("Something went wrong.", 500));
        });
    })
    .catch(() => {
      return next(new HttpError("Something went wrong.", 500));
    });
};

exports.getCart = (req, res, next) => {
  const userId = req.params.userId;

  User.findById(userId)
    .then((user) => {
      user
        .populate("cart.items.productId")
        .execPopulate()
        .then((user) => {
          const products = user.cart.items;

          let totalPrice = 0;
          products.forEach((product) => {
            totalPrice += product.productId.price * product.quantity;
          });

          res.status(200).json({ products: products, totalPrice: totalPrice });
        })
        .catch(() => {
          return next(new HttpError("Something went wrong.", 500));
        });
    })
    .catch(() => {
      return next(new HttpError("Something went wrong.", 500));
    });
};

exports.postDeleteFromCart = (req, res, next) => {
  const userId = req.params.userId;
  const productId = req.params.productId;

  User.findById(userId)
    .then((user) => {
      user
        .deleteFromCart(productId)
        .then(() => {
          return res
            .status(201)
            .json({ message: "product delete successfully from cart.", error: false });
        })
        .catch(() => {
          return next(new HttpError("Something went wrong.", 500));
        });
    })
    .catch((err) => {
      return next(new HttpError("Something went wrong.", 500));
    });
};

exports.postDecreaseQuantityFromCart = (req, res, next) => {
  const userId = req.params.userId;
  const productId = req.params.productId;

  Product.findById({ _id: productId })
    .then((product) => {
      User.findById(userId)
        .then((user) => {
          return user.decreaseQuantity(product);
        })
        .then(() => {
          return res.status(201).json({
            message: "Product successfully added to cart.",
            error: false,
          });
        })
        .catch(() => {
          return next(new HttpError("Something went wrong.", 500));
        });
    })
    .catch(() => {
      return next(new HttpError("Something went wrong.", 500));
    });
};

exports.postOrder = (req, res, next) => {
  const userId = req.params.userId;

  User.findById(userId)
    .then((user) => {
      user
        .populate("cart.items.productId")
        .execPopulate()
        .then((user) => {
          const products = user.cart.items.map((i) => {
            return { quantity: i.quantity, product: { ...i.productId._doc } };
          });

          const order = new Order({
            products: products,
            user: {
              userId: user._id,
              email: user.email,
            },
          });

          user.cart.items = [];
          user.save();

          return order.save();
        })
        .then(() => {
          return res
            .status(200)
            .json({ message: "order added successfully", error: false });
        })
        .catch((err) => {
          return next(new HttpError("Something went wrong.", 500));
        });
    })
    .catch((err) => {
      return next(new HttpError("Something went wrong.", 500));
    });
};

exports.getOrders = (req, res, next) => {
  const userId = req.params.userId;

  Order.find({ "user.userId": userId })
    .then((orders) => {
      res.status(200).json({ orders: orders });
    })
    .catch((err) => {
      return next(new HttpError("Something went wrong.", 500));
    });
};
