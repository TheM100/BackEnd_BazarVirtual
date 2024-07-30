const mongooselib = require("mongoose");

const socialNetworksSchema = new mongooselib.Schema({

    platform: {
        type: String,
        
        },

    url: {
    type: String,
    
    },


        
  
});



module.exports = socialNetworksSchema;
