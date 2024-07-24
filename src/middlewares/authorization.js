const jwt = require("jsonwebtoken");
const JWT_SIGN = process.env.JWT_SIGN;

function verifyJWT(req, res, next) {
  let token = req.headers.authorization;
  const dateNow = new Date();

  if (!token) {
    return res.status(401).send({ msg: "Login required" });
  }

  token = token.split(" ")[1];
  jwt.verify(token, JWT_SIGN, async (err, decoded) => {
    if (err) {
      return res.status(401).send({ msg: "Invalid token" });
    }

    if (decoded.exp < dateNow.getTime() / 1000) {
      return res.status(401).send({ msg: "Expired token" });
    }

    next();
  });
}

module.exports = verifyJWT;
