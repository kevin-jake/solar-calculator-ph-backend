const express = require("express");
const { check } = require("express-validator");

const placesControllers = require("../controllers/inverter-controllers");
const fileUpload = require("../middleware/file-upload");
const checkAuth = require("../middleware/check-auth");

const router = express.Router();

router.get("/", placesControllers.getInverters);

router.get("/:pid", placesControllers.getInverterById);

// router.get("/user/:uid", placesControllers.getInvertersByUserId);

router.use(checkAuth);

router.post(
  "/",
  // fileUpload.single("image"),
  [
    check("inverterName").not().isEmpty(),
    check("inputVoltage").not().isEmpty(),
    check("efficiency").not().isEmpty(),
    check("wattage").not().isEmpty(),
    check("price").not().isEmpty(),
  ],
  placesControllers.createInverter
);

router.patch(
  "/:pid",
  [
    check("inverterName").not().isEmpty(),
    check("inputVoltage").not().isEmpty(),
    check("efficiency").not().isEmpty(),
    check("wattage").not().isEmpty(),
    check("price").not().isEmpty(),
  ],
  placesControllers.updateInverter
);

router.delete("/:pid", placesControllers.deleteInverter);

module.exports = router;
