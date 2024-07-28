const mongooselib = require("mongoose");

const marcasCursoEsquema = new mongooselib.Schema({
  brandId: {
    type: mongooselib.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  //profile
  profilePicture: {
    type: String,
    required: true,
  },

  //nameMarca
  username: {
    type: String,
    required: true,
  },
});

module.exports = marcasCursoEsquema;
