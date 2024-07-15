const mongooselib = require("mongoose");

const marcasCursoEsquema = new mongooselib.Schema({


profile: {
    type: String,
    required: true,
    },

nameMarca: {
    type: String,
    required: true,
    },

        
  
});



module.exports = marcasCursoEsquema;
