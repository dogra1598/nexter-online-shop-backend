const { validationResult } = require("express-validator/check");

const Product = require("../models/product");
const User = require("../models/user");

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  const userId = req.body.userId;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError(errors.array()[0].msg, 422));
  }

  const product = new Product({
    title: title,
    imageUrl: imageUrl,
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

// exports.getEditProduct = (req, res, next) => {
//   const productId = req.params.productId;
//   const eidtMode = req.query.edit;

//   Product.findById({ _id: productId })
//     .then((product) => {
//       res.status(200).render("admin/editProduct", {
//         pageTitle: "Edit Product",
//         path: "/admin/editProduct",
//         editing: eidtMode,
//         product: product,
//         errorMessage: null,
//       });
//     })
//     .catch((err) => {
//       const error = new Error(err);
//       error.httpStatusCode = 500;
//       return next(error);
//     });
// };

// exports.postEditProduct = (req, res, next) => {
//     const prodId = req.body.productId;
//     const updatedTitle = req.body.title;
//     const updatedPrice = req.body.price;
//     const image = req.file;
//     const updatedDesc = req.body.description;

//     const errors = validationResult(req);

//     if (!errors.isEmpty()) {
//       return res.status(422).render('admin/edit-product', {
//         pageTitle: 'Edit Product',
//         path: '/admin/edit-product',
//         editing: true,
//         hasError: true,
//         product: {
//           title: updatedTitle,
//           price: updatedPrice,
//           description: updatedDesc,
//           _id: prodId
//         },
//         errorMessage: errors.array()[0].msg,
//         validationErrors: errors.array()
//       });
//     }

//     Product.findById(prodId)
//         .then(product => {
//             if (product.userId.toString() !== req.user._id.toString()) {
//                 return res.redirect('/');
//             }
//             product.title = updatedTitle;
//             product.price = updatedPrice;
//             product.description = updatedDesc;
//             if (image) {
//                 fileHelper.deleteFile(product.imageUrl);
//                 product.imageUrl = image.path;
//             }
//             return product.save().then(result => {
//                 res.redirect('/admin/adminProducts');
//             });
//         })
//         .catch(err => {
//             const error = new Error(err);
//             error.httpStatusCode = 500;
//             return next(error);
//         });
//   };

exports.postDeleteProduct = (req, res, next) => {
  const productId = req.params.productId;
  const userId = req.params.userId;

  Product.findById({ _id: productId })
    .then((product) => {
      if (!product) {
        return next(new HttpError("No products found.", 422));
      }
      return Product.deleteOne({ _id: productId });
    })
    .then(() => {
      return User.find()
      .then((users) => {
        users.forEach(user => {
          user.deleteFromCart(productId);
        });
      })
    })
    .then(() => {
      return res
        .status(200)
        .json({ message: "Product delete successfully", error: false });
    })
    .catch(() => {
      throw new HttpError("Something went wrong.", 500);
    });
};
