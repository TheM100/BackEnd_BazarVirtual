const bcrypt = require("bcrypt");
const userMarcaModel = require("../models/marca/usersMarca");
const { v4: uuidv4 } = require("uuid");
const mime = require("mime-types");
const AWS = require("aws-sdk");

//configuration AWS S3
AWS.config.update({
  accessKeyId: process.env.ACCESS_KEY_AWS,
  secretAccessKey: process.env.SECRET_ACCES_KEY_AWS,
  region: process.env.REGION_AWS,
});

const s3 = new AWS.S3();

const getUSersMarca = async (req, res) => {
  try {
    const AllUsersMarca = await userMarcaModel.find();
    res.send({
      msg: "Todos las marcas registradas",
      data: AllUsersMarca,
    });
  } catch (error) {
    res.status(400).send({ msg: "No se pudo jalar alos users", error: error });
  }
};

const getMarcaById = async (req, res) => {
  try {
    const idMarca = req.params.id;
    const marcaFromId = await userMarcaModel.findOne({ _id: idMarca });
    res.send({
      msg: "Única marca de la colección marcas",
      data: marcaFromId,
    });
  } catch (error) {
    res
      .status(400)
      .send({ msg: "No se pudo encontrar a la marca", error: error });
  }
};

const registerMarca = async (req, res) => {
  const {
    username,
    email,
    password,
    role,
    socialNetworks,
    description,
    slogan,
    profilePicture,
    salesHistory,
  } = req.body;

  try {
    const existingMail = await userMarcaModel.findOne({ email: email });
    const existingMarcaName = await userMarcaModel.findOne({
      username: username,
    });
    if (existingMail) {
      return res
        .status(400)
        .send({ msg: "El correo electrónico ya está registrado." });
    }
    if (existingMarcaName) {
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

    const user = new userMarcaModel({
      username,
      email,
      profilePicture,
      password: encryptedPassword,
      role,
      description,
      salesHistory: salesHistory || [],
      slogan,
      socialNetworks: parsedSocialNetworks,
    });

    await user.save();
    res.status(200).send({ msg: "Usuario creado con éxito!" });
  } catch (error) {
    console.error(`Error creating user: ${error.message}`);
    res.status(400).send({ msg: "Usuario no guardado", error: error });
  }
};

const updateProfileMarca = async (req, res) => {
  const _id = req.params.id;
  const { socialNetworks, slogan, description, username, profilePicture } = req.body; //agregar el perfilPicture
  try {
    const user = await userMarcaModel.findById(_id);

    if (!user) {
      return res.status(404).send("Usuario no encontrado");
    }

    if (profilePicture) {
      // Detectar el tipo MIME y la extensión de la imagen
      const match = profilePicture.match(
        /^data:(image\/(jpeg|png|gif|bmp|tiff));base64,/
      );
      if (!match) {
        console.log("extencion no soportada");
        return res.status(400).send({ msg: "Tipo de imagen no soportada." });
      }

      const mimeType = match[1];
      const extname = mime.extension(mimeType) || "jpeg";

      // Extraer el base64 de la cadena
      const base64Data = profilePicture.replace(
        /^data:image\/(jpeg|png|gif|bmp|tiff);base64,/,
        ""
      );
      const buffer = Buffer.from(base64Data, "base64");

      // Generar el nombre del archivo con un UUID y la extensión detectada
      const fileName = `${uuidv4()}_${Date.now()}.${extname}`;

      // Definir parámetros de S3
      const s3Params = {
        Bucket: process.env.BUCKET_NAME,
        Key: `profilePicturesMarcas/${fileName}`,
        Body: buffer,
        ContentType: mimeType, // Usa el tipo MIME detectado
      };

      // Subir archivo a S3
      const data = await s3.upload(s3Params).promise();
      user.profilePicture = data.Location;
    }

    if (username) user.username = username;
    user.slogan = slogan;
    user.description = description;
    user.socialNetworks = socialNetworks;

    await user.save();

    res.send(user);
  } catch (error) {
    res.status(500).send("Error al actualizar el usuario");
  }
};

module.exports = {
  getUSersMarca,
  getMarcaById,
  registerMarca,
  updateProfileMarca,
};
