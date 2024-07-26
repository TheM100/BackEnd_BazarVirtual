const mongooselib = require("mongoose");

const especialEventsEsquema = new mongooselib.Schema({


eventName: {
    type: String,
    required: true,
    },

description: {
    type: String,
    required: true,
    },
timeEvent: {
    type: String,
    required: true,
    },

        
  
});



module.exports = especialEventsEsquema;
