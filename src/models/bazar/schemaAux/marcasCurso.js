const mongooselib = require("mongoose");

const marcasCursoSchema = new mongooselib.Schema({

  profile: {
    type: String,
    required: true,
  },

  nameMarca: {
    type: String,
    required: true,
  },

  marcaID: { //este lo agregue al final
    type:String,
    type: mongooselib.Schema.Types.ObjectId,
        ref: 'UsersMarca',
        required: true
    },
});

module.exports = marcasCursoSchema;
