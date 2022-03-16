const express = require("express");
const { check } = require("express-validator");

const solarpanelControllers = require("../controllers/solarpanel-controllers");
// const fileUpload = require("../middleware/file-upload");
const checkAuth = require("../middleware/check-auth");

const router = express.Router();

router.get("/", solarpanelControllers.getSolarPanel);

// router.get("/user/:uid", solarpanelControllers.getSolarPanelsByUserId);

router.use(checkAuth);

router.get("/requests", solarpanelControllers.getSolarPanelReqs);
router.get("/:pid", solarpanelControllers.getSolarPanelById);

router.post(
  "/",
  // fileUpload.single("image"),
  [
    check("pvname").not().isEmpty(),
    check("wattage").not().isEmpty(),
    check("voc").not().isEmpty(),
    check("imp").not().isEmpty(),
    check("vmp").not().isEmpty(),
    check("isc").not().isEmpty(),
    check("price").not().isEmpty(),
  ],
  solarpanelControllers.createSolarPanel
);

router.patch(
  "/:pid",
  [
    check("pvname").not().isEmpty(),
    check("wattage").not().isEmpty(),
    check("voc").not().isEmpty(),
    check("imp").not().isEmpty(),
    check("vmp").not().isEmpty(),
    check("isc").not().isEmpty(),
    check("price").not().isEmpty(),
  ],
  solarpanelControllers.updateSolarPanel
);

router.delete("/:pid", solarpanelControllers.deleteSolarPanel);

router.post(
  "/request",
  // fileUpload.single("image"),
  [
    check("pvname").not().isEmpty(),
    check("wattage").not().isEmpty(),
    check("voc").not().isEmpty(),
    check("imp").not().isEmpty(),
    check("vmp").not().isEmpty(),
    check("isc").not().isEmpty(),
    check("price").not().isEmpty(),
  ],
  solarpanelControllers.createReqSolarPanel
);

router.post(
  "/request/:pid",
  // fileUpload.single("image"),
  [
    check("pvname").not().isEmpty(),
    check("wattage").not().isEmpty(),
    check("voc").not().isEmpty(),
    check("imp").not().isEmpty(),
    check("vmp").not().isEmpty(),
    check("isc").not().isEmpty(),
    check("price").not().isEmpty(),
  ],
  solarpanelControllers.updateReqSolarPanel
);

module.exports = router;
