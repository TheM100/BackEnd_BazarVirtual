const mongooselib = require("mongoose");

const wishListEsquema = new mongooselib.Schema({
  quantity: {
    type: Number,
    required: true,
  },
});

module.exports = wishListEsquema;
