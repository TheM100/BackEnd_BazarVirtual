const mongooselib = require("mongoose");

const marcasCursoEsquema = new mongooselib.Schema({


profile: {
    type: String,
    required: true,
    },

nameBazar: {
    type: String,
    required: true,
    },

        
  
});



module.exports = marcasCursoEsquema;
