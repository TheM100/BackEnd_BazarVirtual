const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const userSchema = require("../models/users");
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

router.post("/register", async (req, res) => {
  const { firstName, email, role, password } = req.body;
  try {
    const salt = await bcrypt.genSalt(10);
    const encryptedPassword = await bcrypt.hash(password, salt);
    const user = await userSchema.create({
      firstName,
      email,
      role,
      password: encryptedPassword,
    });
    await user.save();
    res.status(200).send({ msg: "Usuario creado con exito!" });
  } catch (error) {
    res.status(400).send({ msg: "Usuario no guardado", Error: error });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userSchema.findOne({
      email: email,
    });

    if (!user) {
      res.status(404).send({ msg: "user not found" });
    }
    if (!(await bcrypt.compare(password, user.password))) {
      return res.status(401).send({ msg: "Incorrect password" });
    } else {
      const token = createJWT({
        _id: user._id,
        email: user.email,
        role: user.role,
      });
      res.status(201).send({ msg: "login successfull", data: token });
    }
  } catch (error) {
    res.status(400).send({ msg: "Invalid login", Error: error });
  }
});

module.exports = router;
