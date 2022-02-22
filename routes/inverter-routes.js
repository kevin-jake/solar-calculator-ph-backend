const express = require("express");
const { check } = require("express-validator");

const inverterControllers = require("../controllers/inverter-controllers");
const fileUpload = require("../middleware/file-upload");
const checkAuth = require("../middleware/check-auth");

const router = express.Router();

router.get("/", inverterControllers.getInverters);

router.get("/:pid", inverterControllers.getInverterById);

// router.get("/user/:uid", inverterControllers.getInvertersByUserId);

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
  inverterControllers.createInverter
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
  inverterControllers.updateInverter
);

router.delete("/:pid", inverterControllers.deleteInverter);

module.exports = router;
