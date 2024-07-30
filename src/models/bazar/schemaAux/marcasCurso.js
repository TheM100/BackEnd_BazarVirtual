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

        
  
});



module.exports = marcasCursoSchema;
