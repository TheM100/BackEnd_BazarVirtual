const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const userSchema = require("../models/users");
const usersBazarSchema = require("../models/bazar/bazarUsers");
const userMarcaSchema = require("../models/marca/usersMarca");
const createJWT = require("../middlewares/authentication");

// router.get('/', (req, res) => {
//     res.send('¡Hola, mundo, este endpoint es de users!');
// });

// router.get('/default', (req, res) => {
//     res.send('¡Hola, mundo, este endpoint es de users default!');
// });

router.get("/", async (req, res) => {
  try {
    const AllUsers = await userSchema.find();
    res.send({
      msg: "Todos los usuarios de la coleccion Users",
      data: AllUsers,
    });
  } catch (error) {
    res
      .status(400)
      .send({ msg: "No se pudo extraer a los usuarios", error: error });
  }
});

router.get("/marcas", async (req, res) => {
  try {
    const AllMarcas = await userSchema.find({ role: "marca" });
    res.send({
      msg: "Todas las marcas de la coleccion Users",
      data: AllMarcas,
    });
  } catch (error) {
    res
      .status(400)
      .send({ msg: "No se pudo extraer a las marcas", error: error });
  }
});

router.get("/marcas/:marcaId", async (req, res) => {
  const { marcaId } = req.params;

  try {
    const marcaFromId = await userSchema.findOne({ _id: marcaId });
    res.send({
      msg: "Única marca de la colección Users",
      data: marcaFromId,
    });
  } catch (error) {
    res
      .status(400)
      .send({ msg: "No se pudo extraer a los usuarios", error: error });
  }
});

router.get("/bazares", async (req, res) => {
  try {
    const AllBazares = await userSchema.find({ role: "bazar" });
    res.send({
      msg: "Todos los bazares de la coleccion Users",
      data: AllBazares,
    });
  } catch (error) {
    res
      .status(400)
      .send({ msg: "No se pudo extraer a los bazares", error: error });
  }
});

router.get("/bazares/:bazarId", async (req, res) => {
  const { bazarId } = req.params;
  try {
    const bazarFromId = await userSchema.findOne({ id: bazarId });
    res.send({
      msg: "Único bazar de la coleccion Users",
      data: bazarFromId,
    });
  } catch (error) {
    res
      .status(400)
      .send({ msg: "No se pudo extraer a los usuarios", error: error });
  }
});

router.post("/register", async (req, res) => {
  const { username, email, role, password } = req.body;
  try {
    // Verificar si el correo electrónico ya está registrado
    const existingMail = await userSchema.findOne({ email: email });
    const existingUsername = await userSchema.findOne({ username: username });
    if (existingMail) {
      return res
        .status(400)
        .send({ msg: "El correo electrónico ya está registrado." });
    }
    if (existingUsername) {
      return res
        .status(400)
        .send({ msg: "Nombre de usuario registrado, prueba con otro." });
    }
    // Encriptar la contraseña
    const salt = await bcrypt.genSalt(10);
    const encryptedPassword = await bcrypt.hash(password, salt);
    // console.log(encryptedPassword)

    // Crear un nuevo usuario
    const user = new userSchema({
      username,
      email,
      password: encryptedPassword,
      profilePicture:
        "https://i.pinimg.com/564x/57/00/c0/5700c04197ee9a4372a35ef16eb78f4e.jpg",
      role,
    });

    await user.save();
    res.status(200).send({ msg: "Usuario creado con éxito!" });
  } catch (error) {
    res.status(400).send({ msg: "Usuario no guardado", Error: error });
  }
});

router.post("/login", async (req, res) => {
  //este enPoint es usado por los 3 tipos de users
  try {
    const { email, password } = req.body;

    const schemas = [userSchema, usersBazarSchema, userMarcaSchema];

    let user = null;

    // Iterar sobre cada esquema para buscar al usuario por email
    for (let schema of schemas) {
      user = await schema.findOne({ email });
      if (user) break; // Si encontramos al usuario, salimos del bucle
    }

    if (!user) {
      return res.status(404).send({ msg: "user not found" });
    }
    if (!(await bcrypt.compare(password, user.password))) {
      return res.status(401).send({ msg: "Incorrect password" });
    } else {
      const token = createJWT({
        _id: user._id,
        email: user.email,
        role: user.role,
      });
      return res.status(201).send({ msg: "login successfull", data: token });
    }
  } catch (error) {
    res.status(400).send({ msg: "Invalid login", Error: error });
  }
});

module.exports = router;
