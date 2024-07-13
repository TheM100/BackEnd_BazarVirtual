const express = require("express");
const router = express.Router();
const dateBazarSchema = require("../models/bazar/newDateBazar")
const validateDate = require("../middlewares/bazarMiddle")
const bcrypt = require("bcrypt");
const usersBazarSchema = require("../models/bazar/bazarUsers")
const createJWT = require("../middlewares/authentication");



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


  router.post("/register", async (req, res) => {
    const { username, email, wepPage, socialNetworks, password, role } = req.body;
  
    try {
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
      
      let parsedSocialNetworks = [];
      if (Array.isArray(socialNetworks)) {
      parsedSocialNetworks = socialNetworks.map(network => ({
        platform: network.platform,
        url: network.url
      }));
    }
  
      const user = new usersBazarSchema({
        username,
        email,
        wepPage:"",
        socialNetworks: parsedSocialNetworks,
        profilePicture:"" ,
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


  router.put('/updateProfile/:id', async (req, res)=>{
    const _id = req.params.id;
    const { username, wepPage, socialNetworks } = req.body; //agregar el perfilPicture
    try {

      const user = await usersBazarSchema.findById(_id);

      if (!user) {
        return res.status(404).send('Usuario no encontrado');
      }

      if (username) user.username = username;
      user.wepPage = wepPage;
      user.socialNetworks = socialNetworks;

      await user.save();

      res.send(user);
  
      
    } catch (error) {
      res.status(500).send('Error al actualizar el usuario');
    }
  } )


  

  
  module.exports = router;