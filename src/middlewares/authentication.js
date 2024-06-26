const jwt = require("jsonwebtoken")
const JWT_SIGN = process.env.JWT_SIGN;

function  createJWT(data){

return jwt.sign(data, JWT_SIGN,{expiresIn:"1h"});

}

module.exports = createJWT;
