const mongooselib = require("mongoose");
const especialEventsEsquema = require('./eschemaAux/especialEvents');
const marcasCursoEsquema = require('./eschemaAux/marcasCurso')

const newDateBazarEsquema = new mongooselib.Schema({
createdBy: {
    type:String,
    type: mongooselib.Schema.Types.ObjectId,
        ref: 'usersBazar',
        required: true
    },
  place: {
    type: String,
    required: true,
    
  },
  date: {
    type: Date,
    required: true,  
   
  },
  time: {
    type: String,
    required: true,
   
  },
  marcasCurso: {
    type: [marcasCursoEsquema],
    
  
   
  },
  events: {
    type: [especialEventsEsquema],
    required: true,
    
  },
});

const dateBazarSchema = mongooselib.model("newDateBazar", newDateBazarEsquema, "datesBazares"); //primer parametro:nombre_modelo, segundo parametro: nombre_esquema_a_utilizar, tercer parametro: nombre-de-coleccion-en-la-BD

module.exports = dateBazarSchema;
