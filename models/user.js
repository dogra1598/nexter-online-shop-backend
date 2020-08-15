const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  userName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  cart: {
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
      },
    ],
  },
});

userSchema.methods.addToCart = function (product) {
  const cartProductIndex = this.cart.items.findIndex((i) => {
    return i.productId.toString() === product._id.toString();
  });

  let newQuantity = 1;
  const updatedCartItems = [...this.cart.items];

  if (cartProductIndex >= 0) {
    updatedCartItems[cartProductIndex].quantity += newQuantity;
  } else {
    updatedCartItems.push({
      productId: product._id,
      quantity: newQuantity,
    });
  }

  const updatedCart = {
    items: updatedCartItems,
  };

  this.cart = updatedCart;
  return this.save();
};

userSchema.methods.decreaseQuantity = function (product) {
  const cartProductIndex = this.cart.items.findIndex((i) => {
    return i.productId.toString() === product._id.toString();
  });

  const updatedCartItems = [...this.cart.items];

  if (cartProductIndex >= 0) {
    if(updatedCartItems[cartProductIndex].quantity > 1) {
      updatedCartItems[cartProductIndex].quantity -= 1;
    } else {
      updatedCartItems = this.cart.items.filter((i) => {
        return product_id.toString() !== i.productId.toString();
      });
    }  
  }

  const updatedCart = {
    items: updatedCartItems,
  };

  this.cart = updatedCart;
  return this.save();
}

userSchema.methods.deleteFromCart = function (productId) {
  const updatedCartItems = this.cart.items.filter((i) => {
    return productId.toString() !== i.productId.toString();
  });

  const updatedCart = {
    items: updatedCartItems,
  };

  this.cart = updatedCart;
  return this.save();
};

module.exports = mongoose.model("User", userSchema);
