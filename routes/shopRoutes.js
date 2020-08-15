const express = require("express");

const shopControllers = require("../controllers/shopControllers");

const router = express.Router();

router.get("/", shopControllers.getIndex);

router.get("/products/:productId", shopControllers.getProduct);

router.post("/cart", shopControllers.postCart);

router.get('/cart/:userId', shopControllers.getCart);

router.delete('/deleteFromCart/:userId/:productId', shopControllers.postDeleteFromCart);

router.delete('/decreaseQuantity/:userId/:productId', shopControllers.postDecreaseQuantityFromCart);

router.post('/orders/:userId', shopControllers.postOrder);

router.get('/orders/:userId', shopControllers.getOrders);


module.exports = router;
