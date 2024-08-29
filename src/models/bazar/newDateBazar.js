const mongooselib = require("mongoose");
const especialEventsSchema = require("./schemaAux/especialEvents");
const marcasCursoSchema = require("./schemaAux/marcasCurso");

const newDateBazarSchema = new mongooselib.Schema({
  createdBy: {
    type: String,
    type: mongooselib.Schema.Types.ObjectId,
    ref: "usersBazar",
    required: true,
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
    type: [marcasCursoSchema],
  },
  events: {
    type: [especialEventsSchema],
  },
});

const dateBazarModel = mongooselib.model(
  "newDateBazar",
  newDateBazarSchema,
  "datesBazares"
); //primer parametro:nombre_modelo, segundo parametro: nombre_esquema_a_utilizar, tercer parametro: nombre-de-coleccion-en-la-BD

module.exports = dateBazarModel;
