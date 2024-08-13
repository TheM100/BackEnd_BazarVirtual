const express = require("express");
const router = express.Router();
const multer = require("multer");
const validateDate = require("../middlewares/bazarMiddle");

const {
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
  deleteSpecialEvent,
  deteleOfMarcasCurso
} = require("../controllers/bazarControllers");




router.get("/", getDatesBazar);

router.get("/usersBazar", getUsersBazar);

router.get("/bazarUser/:id", userBazarById);

router.get("/bazarDates", getBazarDates);

router.get("/dateById/:dateId", getDateById);

router.get("/datesUser/:_idUser", getDatesOfUserBazar);

router.post("/createDate", validateDate, createDate);

router.post("/register", registerUserBazar);

router.put("/updateProfile/:id", updateProfileBazar );

router.put("/updateMarcasCurso/:id", updateMarcasCurso);

router.put("/updateDateBazar/:id", updateDateBazar);

router.put("/deleteSubscription/:id", deteleOfMarcasCurso);

router.delete("/datesBazares/:bazarId/events/:eventId", deleteSpecialEvent);

module.exports = router;
