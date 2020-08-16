const express = require("express");
const { body } = require("express-validator/check");

const adminControllers = require("../controllers/adminControllers");
const fileUpload = require("../middlewares/fileUpload");
const checkAuth = require("../middlewares/checkAuth");

const router = express.Router();

router.use(checkAuth);

router.post(
  "/addProduct",
  fileUpload.single("image"),
  [
    body("price")
      .isNumeric()
      .withMessage("Please enter a valid price e.g:15.99"),
    body("description")
      .isLength({ min: 20, max: 5000 })
      .withMessage(
        "Please enter a description with  at least 20 characters and at max 5000 characters."
      ),
  ],
  adminControllers.postAddProduct
);

router.get("/products/:userId", adminControllers.getAdminProducts);

router.get('/editProduct/:productId', adminControllers.getEditProduct);

router.patch(
    '/editProduct',
    fileUpload.single("image"),
    [
        body('price')
            .isNumeric()
            .withMessage('Please enter a valid price e.g:15.99'),
        body('description')
            .isLength({ min: 10, max: 500 })
            .withMessage('Please enter a description with  at least 20 characters and at max 5000 characters.')
    ],
    adminControllers.patchEditProduct);

router.delete('/deleteProduct/:userId/:productId', adminControllers.postDeleteProduct);

module.exports = router;
