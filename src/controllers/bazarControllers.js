const { v4: uuidv4 } = require('uuid');
const AWS = require('aws-sdk');
const dateBazarModel = require("../models/bazar/newDateBazar");
const bcrypt = require("bcrypt");
const usersBazarModel = require("../models/bazar/bazarUsers")

//subir imagen:



//configuration AWS S3
AWS.config.update({
  accessKeyId: process.env.ACCESS_KEY_AWS,
  secretAccessKey: process.env.SECRET_ACCES_KEY_AWS,
  region: process.env.REGION_AWS
});

const s3 = new AWS.S3();


//-------------------

const getDatesBazar = async (req, res) => {
    try {
      const AlldatesBazar = await dateBazarModel.find();
      res.send({msg: "Todas las fechas de dateBazar", data: AlldatesBazar,
      });
    } catch (error) {
      res.status(400).send({ msg: "No se pueo extraer las fechas", error: error });
    }
  }

  const getUsersBazar = async (req, res) => {
    try {
      const AllUsersBazar = await usersBazarModel.find();
      res.send({
        msg: "Todos los bazares registrados",
        data: AllUsersBazar,
      });
    } catch (error) {
      res.status(400).send({ msg: "No se pudo jalar alos users", error: error });
    }
  }

  const userBazarById = async (req, res) => {
    try {
      const idUser = req.params.id;
  
      const dataUSer = await usersBazarModel.findById(idUser);

      if (dataUSer) {
        res.status(200).json({
          success: true,
          message: "User con ese id:",
          data: dataUSer,
        });
      } else {
        res.status(404).json({
          success: false,
          message: "No se encontro algun user con ese ID",
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error interno del servidor",
        error: error.message,
      });
    }
  }

  const getBazarDates =  async (req, res) => {
    try {
      const allDatesBazares = await dateBazarModel
        .find()
        .populate({
          path: "createdBy",
          select: "profilePicture", // Selecciona solo la imagen de perfil del usuario
        })
        .exec();
  
        res.send({
          msg: "Todas las fechas disponibles",
          data: allDatesBazares,
        });
      } catch (error) {
        res.status(400).send({ msg: "No fue posible extraer las fechas de los bazares:)", error: error }); 
      }
    }

const getDateById = async (req,res)=>{
        try {
          const idDate = req.params.dateId;
          
          const date = await dateBazarModel.findById(idDate);
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
      }

const getDatesOfUserBazar = async (req,res)=>{
        try {
          const idUser = req.params._idUser;
          
          const dates = await dateBazarModel.find({ createdBy: `${idUser}`} );
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
      }

const createDate = async (req, res) => {
        try {
          let newDate = req.body;
          //  console.log('newDate ', newDate);
          const date = await dateBazarModel.create(newDate);
          
      
          res.status(201).send({ msg: "Fecha Creada con exito!"});
        } catch (error) {
          console.log("error ", error);
          res.status(400).send({ msg: "No fue posible crear la fecha", error: error });
        }
      }

const registerUserBazar = async (req, res) => {
        const { username, email, webPage, socialNetworks, password, role } = req.body;
      
        try {
          const existingMail = await usersBazarModel.findOne({ email: email });
          const existingBazarName = await usersBazarModel.findOne({
            username: username,
          });
          if (existingMail) {
            return res
              .status(400)
              .send({ msg: "El correo electrónico ya está registrado." });
          }
          if (existingBazarName) {
            return res
              .status(400)
              .send({ msg: "Nombre de usuario registrado, prueba con otro." });
          }
      
          // Encriptar la contraseña
          const salt = await bcrypt.genSalt(10);
          const encryptedPassword = await bcrypt.hash(password, salt);
      
          let parsedSocialNetworks = [];
          if (Array.isArray(socialNetworks)) {
            parsedSocialNetworks = socialNetworks.map((network) => ({
              platform: network.platform,
              url: network.url,
            }));
          }
      
          const user = new usersBazarModel({
            username,
            email,
            webPage: "",
            socialNetworks: parsedSocialNetworks,
            profilePicture:
              "https://i.pinimg.com/236x/c4/02/5d/c4025d4031edfa78ce3dd60a144f77ed.jpg",
            password: encryptedPassword,
            role,
          });
      
          await user.save();
          res.status(200).send({ msg: "Usuario creado con éxito!" });
        } catch (error) {
          console.error(`Error creating user: ${error.message}`);
          res.status(400).send({ msg: "Usuario no guardado", error: error });
        }
      }

const updateProfileBazar = async (req, res) => {
        const _id = req.params.id;
        const { username, webPage, socialNetworks } = req.body;
        const file = req.file;
      
        try {
      
          const user = await usersBazarModel.findById(_id);
      
          if (!user) {
            return res.status(404).send("Usuario no encontrado");
          }
          if (file) {
            const s3Params = {
              Bucket: process.env.BUCKET_NAME,
              Key: `profilePictures/${uuidv4()}_${file.originalname}`, // Genera un nombre de archivo único
              Body: file.buffer,
              ContentType: file.mimetype,
            };
      
            const data = await s3.upload(s3Params).promise();
            user.profilePicture = data.Location; // Actualiza la imagen de perfil solo si se carga una nueva
          }
      
          user.username = username;
          user.webPage = webPage;
          user.socialNetworks = socialNetworks;
      
          await user.save();
         res.send(user);
        } catch (error) {
          console.error(error);
          res.status(500).send("Error al actualizar el perfil del usuario");
        }
      }

const updateMarcasCurso = async (req, res) => {
        const _id = req.params.id;
        const { profile, nameMarca } = req.body; //agregar el perfilPicture
        try {
          const date = await dateBazarModel.findById(_id);
      
          if (!date) {
            return res.status(404).send("Fecha no encontrada");
          }
      
          date.marcasCurso.push({ profile, nameMarca });
      
          await date.save();
      
          res.send(date);
        } catch (error) {
          res.status(500).send("Error al actualizar las marcas en la fecha deseada");
        }
      }

const updateDateBazar =  async (req, res)=>{
        const _id = req.params.id;
        const {place, date, time, events } = req.body; 
        
        try {
    
          const existingDate  = await dateBazarModel.findById(_id);
    
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
      }

const deleteSpecialEvent = async (req, res)=>{
        const { bazarId, eventId } = req.params;
        try {
          // Buscar el documento y eliminar el evento
          const result = await dateBazarModel.findByIdAndUpdate(
              bazarId,
              { $pull: { events: { _id: eventId } } },
              { new: true } // Opcional: retorna el documento actualizado
          );
          if (!result) {
              return res.status(404).json({ msj: 'Bazar no encontrado' });
          }
    
        res.status(200).json({ msj: "Evento eliminado", result });
      } catch (error) {
        console.error(error);
        res.status(500).json({ msj: "Error al eliminar el evento", error });
      }
    }

  module.exports = {
    getDatesBazar,
    getUsersBazar,
    userBazarById,
    getBazarDates,
    getDateById,
    getDatesOfUserBazar,
    createDate,
    registerUserBazar,
    updateProfileBazar,
    updateMarcasCurso,
    updateDateBazar,
    deleteSpecialEvent
  }