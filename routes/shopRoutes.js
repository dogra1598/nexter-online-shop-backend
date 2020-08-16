const express = require("express");

const shopControllers = require("../controllers/shopControllers");
const checkAuth = require("../middlewares/checkAuth");

const router = express.Router();

router.get("/", shopControllers.getIndex);

router.get("/products/:productId", shopControllers.getProduct);

router.use(checkAuth);

router.post("/cart", shopControllers.postCart);

router.get('/cart/:userId', shopControllers.getCart);

router.delete('/deleteFromCart/:userId/:productId', shopControllers.postDeleteFromCart);

router.delete('/decreaseQuantity/:userId/:productId', shopControllers.postDecreaseQuantityFromCart);

router.post('/orders/:userId', shopControllers.postOrder);

router.get('/orders/:userId', shopControllers.getOrders);


module.exports = router;
