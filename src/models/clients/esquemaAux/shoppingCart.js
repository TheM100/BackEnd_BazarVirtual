const mongooselib = require("mongoose");

const shoppingCartEsquema = new mongooselib.Schema({
  quantity: {
    type: Number,
    required: true,
  },
});

module.exports = shoppingCartEsquema;
