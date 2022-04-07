const express = require("express");
const { check } = require("express-validator");

const othersControllers = require("../controllers/others-controllers");
// const fileUpload = require("../middleware/file-upload");
const checkAuth = require("../middleware/check-auth");

const router = express.Router();

router.get("/", othersControllers.getSCC);

// router.get("/user/:uid", othersControllers.getSCCByUserId);

router.use(checkAuth);

router.get("/requests", othersControllers.getSCCReqs);
router.get("/:pid", othersControllers.getSCCById);

router.post(
  "/",
  // fileUpload.single("image"),
  [
    check("sccname").not().isEmpty(),
    check("type").not().isEmpty(),
    check("brand").not().isEmpty(),
    check("supplier").not().isEmpty(),
    check("amprating").not().isEmpty(),
    check("price").not().isEmpty(),
  ],
  othersControllers.createSCC
);

router.patch(
  "/:pid",
  [
    check("sccname").not().isEmpty(),
    check("type").not().isEmpty(),
    check("brand").not().isEmpty(),
    check("supplier").not().isEmpty(),
    check("amprating").not().isEmpty(),
    check("price").not().isEmpty(),
  ],
  othersControllers.updateSCC
);

router.post(
  "/request",
  // fileUpload.single("image"),
  [
    check("sccname").not().isEmpty(),
    check("type").not().isEmpty(),
    check("brand").not().isEmpty(),
    check("supplier").not().isEmpty(),
    check("amprating").not().isEmpty(),
    check("price").not().isEmpty(),
  ],
  othersControllers.createReqSCC
);

router.post(
  "/request/:pid",
  // fileUpload.single("image"),
  [
    check("sccname").not().isEmpty(),
    check("type").not().isEmpty(),
    check("brand").not().isEmpty(),
    check("supplier").not().isEmpty(),
    check("amprating").not().isEmpty(),
    check("price").not().isEmpty(),
  ],
  othersControllers.updateReqSCC
);

router.patch(
  "/request/:pid",
  [check("status").not().isEmpty()],
  othersControllers.statusUpdateSCC
);

router.delete("/:pid", othersControllers.deleteSCC);

module.exports = router;
