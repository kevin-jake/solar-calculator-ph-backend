const express = require("express");
const { check } = require("express-validator");

const batteryControllers = require("../controllers/battery-controllers");
// const fileUpload = require("../middleware/file-upload");
const checkAuth = require("../middleware/check-auth");

const router = express.Router();

router.get("/", batteryControllers.getBattery);

router.get("/:pid", batteryControllers.getBatteryById);

// router.get("/user/:uid", inverterControllers.getInvertersByUserId);

router.use(checkAuth);

router.post(
  "/",
  // fileUpload.single("image"),
  [
    check("battname").not().isEmpty(),
    check("batttype").not().isEmpty(),
    check("voltage").not().isEmpty(),
    check("battcapacity").not().isEmpty(),
    check("priceperpc").not().isEmpty(),
  ],
  batteryControllers.createBattery
);

router.patch(
  "/:pid",
  [
    check("battname").not().isEmpty(),
    check("batttype").not().isEmpty(),
    check("voltage").not().isEmpty(),
    check("battcapacity").not().isEmpty(),
    check("priceperpc").not().isEmpty(),
  ],
  batteryControllers.updateBattery
);

router.delete("/:pid", batteryControllers.deleteBattery);

module.exports = router;
