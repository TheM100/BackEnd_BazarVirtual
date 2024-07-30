const express = require("express");
const router = express.Router();


const {getUSersMarca, getMarcaById, registerMarca, updateProfileMarca} = require("../controllers/marcaControllers")

router.get("/usersMarca", getUSersMarca );

router.get("/:id", getMarcaById );

router.post("/register", registerMarca);

router.put("/updateProfile/:id", updateProfileMarca);

module.exports = router;
