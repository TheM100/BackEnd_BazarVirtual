const mongooselib = require("mongoose");

const especialEventsSchema = new mongooselib.Schema({


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



module.exports = especialEventsSchema;
