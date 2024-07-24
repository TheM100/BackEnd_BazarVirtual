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

  router.get("/bazarDates", async (req, res) => {
    try {
      const allDatesBazares = await dateBazarSchema.find().populate({ //uso de populate para poblar el campo createdBy con id del bazar creador y profile picture
        path: 'createdBy',
        select: 'profilePicture' // Selecciona solo la imagen de perfil del usuario
    }).exec();

      res.send({
        msg: "Todas las fechas disponibles",
        data: allDatesBazares,
      });
    } catch (error) {
      res.status(400).send({ msg: "No fue posible extraer las fechas de los bazares:)", error: error }); 
    }
  });


  

  router.get("/dateById/:dateId", async (req,res)=>{
    try {
      const idDate = req.params.dateId;
      
      const date = await dateBazarSchema.findById(idDate);
      // console.log(date)
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


  router.get("/datesUser/:_idUser", async (req,res)=>{
    try {
      const idUser = req.params._idUser;
      
      const dates = await dateBazarSchema.find({ createdBy: `${idUser}`} );
      // console.log(dates)
      if(dates){
        res.status(200).json({
          success: true,
          message: 'Dates de tu bazar:',
          data: dates
        });
      }else{
        res.status(404).json({
          success: false,
          message: 'no se encontraron fechas de este bazar'
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
      //  console.log('newDate ', newDate);
      const date = await dateBazarSchema.create(newDate);
      
  
      res.status(201).send({ msg: "Fecha Creada con exito!"});
    } catch (error) {
      console.log("error ", error);
      res.status(400).send({ msg: "No fue posible crear la fecha", error: error });
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
        profilePicture:"https://i.pinimg.com/236x/c4/02/5d/c4025d4031edfa78ce3dd60a144f77ed.jpg" ,
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


  router.put('/updateMarcasCurso/:id', async (req, res)=>{
    const _id = req.params.id;
    const {profile, nameMarca } = req.body; //agregar el perfilPicture
    try {

      const date = await dateBazarSchema.findById(_id);

      if (!date) {
        return res.status(404).send('Fecha no encontrada');
      }

      date.marcasCurso.push({ profile, nameMarca });

      await date.save();

      res.send(date);
  
      
    } catch (error) {
      res.status(500).send('Error al actualizar las marcas en la fecha deseada');
    }
  } )


  router.put('/updateDateBazar/:id', async (req, res)=>{
    const _id = req.params.id;
    const {place, date, time, events } = req.body; 
    
    try {

      const existingDate  = await dateBazarSchema.findById(_id);

      if (!existingDate ) {
        return res.status(404).send('Fecha no encontrada');
      }

      existingDate.place = place
      existingDate.date = date
      existingDate.time = time
      existingDate.events = events

      const updatedDate = await existingDate.save();

      res.send(updatedDate);
  
      
    } catch (error) {
      res.status(500).send('Error al actualizar las marcas en la fecha deseada');
    }
  } )



  router.delete('/datesBazares/:bazarId/events/:eventId', async (req, res)=>{
    const { bazarId, eventId } = req.params;
    try {
      // Buscar el documento y eliminar el evento
      const result = await dateBazarSchema.findByIdAndUpdate(
          bazarId,
          { $pull: { events: { _id: eventId } } },
          { new: true } // Opcional: retorna el documento actualizado
      );
      if (!result) {
          return res.status(404).json({ msj: 'Bazar no encontrado' });
      }

      res.status(200).json({ msj: 'Evento eliminado', result });
  } catch (error) {
      console.error(error);
      res.status(500).json({ msj: 'Error al eliminar el evento', error });
  }
   })


  

  
  module.exports = router;