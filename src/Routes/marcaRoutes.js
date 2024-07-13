const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const userMarcaSchema = require("../models/marca/usersMarca")
const createJWT = require("../middlewares/authentication");


router.get("/usersMarca", async (req, res) => {
    try {
      const AllUsersMarca = await userMarcaSchema.find();
      res.send({
        msg: "Todos las marcas registradas",
        data: AllUsersMarca,
      });
    } catch (error) {
      res.status(400).send({ msg: "No se pudo jalar alos users", error: error });
    }
  });


router.post("/register", async (req, res) => {
    
    const { username, email,  password, role } = req.body;
  
    try {
      const existingMail = await userMarcaSchema.findOne({ email: email });
      const existingBazarName = await userMarcaSchema.findOne({ username: username });
      if (existingMail) {
        return res.status(400).send({ msg: "El correo electrónico ya está registrado." });
      }
      if (existingBazarName) {
        return res.status(400).send({ msg: "Nombre de usuario registrado, prueba con otro." });
      }
  
      // Encriptar la contraseña
      const salt = await bcrypt.genSalt(10);
      const encryptedPassword = await bcrypt.hash(password, salt);
      
      
      const user = new userMarcaSchema({
        username,
        email,
        profilePicture:"" ,
        password: encryptedPassword,
        role,
        description:"",
        slogan:""
      });
  
      await user.save();
      res.status(200).send({ msg: "Usuario creado con éxito!" });
    } catch (error) {
      console.error(`Error creating user: ${error.message}`);
      res.status(400).send({ msg: "Usuario no guardado", error: error });
    }
  });

  module.exports = router;