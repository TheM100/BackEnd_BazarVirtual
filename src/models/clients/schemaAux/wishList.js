const mongooselib = require("mongoose");

const wishListSchema = new mongooselib.Schema({
  quantity: {
    type: Number,
    required: true,
  },
  productId: {
    type: mongooselib.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
});

module.exports = wishListSchema;
