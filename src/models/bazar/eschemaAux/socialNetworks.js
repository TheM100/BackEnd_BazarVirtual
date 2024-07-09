const mongooselib = require("mongoose");

const socialNetworksEsquema = new mongooselib.Schema({

    platform: {
        type: String,
        
        },

    url: {
    type: String,
    
    },


        
  
});



module.exports = socialNetworksEsquema;
