const express = require("express");
const router = express.Router();
const dateBazarSchema = require("../models/bazar/newDateBazar")
const validateDate = require("../middlewares/bazarMiddle")
const bcrypt = require("bcrypt");
const usersBazarSchema = require("../models/bazar/bazarUsers")
const createJWT = require("../middlewares/authentication");
const fs = require('fs');
const multer = require('multer');

//invocando a multer para carga de imagenes
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });



//EndPoint Register:
router.post("/register", upload.single("profilePicture"), async (req, res) => {
  const { username, email, wepPage, socialNetworks, password, role } = req.body;

  try {
    // Verificar si el correo electrónico ya está registrado
    const existingMail = await usersBazarSchema.findOne({ email: email });
    const existingBazarName = await usersBazarSchema.findOne({ username: username });
    if (existingMail) {
      return res.status(400).send({ msg: "El correo electrónico ya está registrado." });
    }
    if (existingBazarName) {
      return res.status(400).send({ msg: "Nombre de usuario registrado, prueba con otro." });
    }

    // Encriptar la contraseña
    const salt = await bcrypt.genSalt(10);
    const encryptedPassword = await bcrypt.hash(password, salt);

    //declarando constante con el path de la img
    const defaultProfilePicturePath = "utils/DefaultProfile.jpg";
    let defaultProfilePicture;

    //leyendo el path para extraer la img
    try {
      defaultProfilePicture = fs.readFileSync(defaultProfilePicturePath);
    } catch (err) {
      console.error(`Error reading default profile picture: ${err.message}`);
      return res.status(500).send({ msg: "Error reading default profile picture", error: err.message });
    }

    //se asigna dicha imagen a constante profilePicture para guardarla abajo
    const profilePicture = req.file ? req.file.buffer : defaultProfilePicture;
    

    // Crear un nuevo usuario
    const user = new usersBazarSchema({
      username,
      email,
      wepPage,
      socialNetworks, // Si socialNetworks es un array de objetos, parsearlo
      profilePicture,
      password: encryptedPassword,
      role,
    });

    await user.save();
    res.status(200).send({ msg: "Usuario creado con éxito!" });
  } catch (error) {
    console.error(`Error creating user: ${error.message}`);
    res.status(400).send({ msg: "Usuario no guardado", error: error });
  }
});

//-------------

//-------------

router.get("/", async (req, res) => {
    try {
      const AlldatesBazar = await dateBazarSchema.find();
      res.send({
        msg: "Todas las fechas de dateBazar",
        data: AlldatesBazar,
      });
    } catch (error) {
      res.status(400).send({ msg: "No se pueo extraer las fechas", error: error });
    }
  });

  router.get("/usersBazar", async (req, res) => {
    try {
      const AllUsersBazar = await usersBazarSchema.find();
      res.send({
        msg: "Todos los bazares registrados",
        data: AllUsersBazar,
      });
    } catch (error) {
      res.status(400).send({ msg: "No se pudo jalar alos users", error: error });
    }
  });

  router.get("/bazarUser/:id", async (req,res)=>{
    try {
      const idUser = req.params.id;
      
      const dataUSer = await usersBazarSchema.findById(idUser);
      // console.log(dataUSer)
      if(dataUSer){
        res.status(200).json({
          success: true,
          message: 'User con ese id:',
          data: dataUSer
        });
      }else{
        res.status(404).json({
          success: false,
          message: 'No se encontro algun user con ese ID'
        });
      }
      
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message
      });
    }
  });

  

  router.get("/dateById/:dateId", async (req,res)=>{
    try {
      const idDate = req.params.dateId;
      
      const date = await dateBazarSchema.findById(idDate);
      console.log(date)
      if(date){
        res.status(200).json({
          success: true,
          message: 'Dates con ese id:',
          data: date
        });
      }else{
        res.status(404).json({
          success: false,
          message: 'No se encontro alguna fecha con ese ID'
        });
      }
      
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message
      });
    }
  });


  router.post("/createDate", validateDate, async (req, res) => {
    try {
      let newDate = req.body;
       console.log('newDate ', newDate);
      const date = await dateBazarSchema.create(newDate);
      
  
      res.status(201).send({ msg: "Date created", data: date });
    } catch (error) {
      console.log("error ", error);
      res.status(400).send({ msg: "can't create date", error: error });
    }
  });

  
  module.exports = router;