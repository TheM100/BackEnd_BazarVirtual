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
} = require("../controllers/bazarControllers");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get("/", getDatesBazar);

router.get("/usersBazar", getUsersBazar);

router.get("/bazarUser/:id", userBazarById);

router.get("/bazarDates", getBazarDates);

router.get("/dateById/:dateId", getDateById);

router.get("/datesUser/:_idUser", getDatesOfUserBazar);

router.post("/createDate", validateDate, createDate);

router.post("/register", registerUserBazar);

router.put("/updateProfile/:id", upload.single("imagen"), updateProfileBazar);

router.put("/updateMarcasCurso/:id", updateMarcasCurso);

router.put("/updateDateBazar/:id", updateDateBazar);

router.delete("/datesBazares/:bazarId/events/:eventId", deleteSpecialEvent);

module.exports = router;
