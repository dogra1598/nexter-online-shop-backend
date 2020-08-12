const express = require("express");

const shopControllers = require("../controllers/shopControllers");

const router = express.Router();

router.get("/", shopControllers.getIndex);

router.get("/products/:productId", shopControllers.getProduct);


module.exports = router;
