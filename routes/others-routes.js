const express = require("express");
const { check } = require("express-validator");

const othersControllers = require("../controllers/others-controllers");
// const fileUpload = require("../middleware/file-upload");
const checkAuth = require("../middleware/check-auth");

const router = express.Router();

router.get("/", othersControllers.getOthers);

// router.get("/user/:uid", othersControllers.getOthersByUserId);

router.use(checkAuth);

router.get("/requests", othersControllers.getOthersReqs);
router.get("/:pid", othersControllers.getOthersById);

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
  othersControllers.createOthers
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
  othersControllers.updateOthers
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
  othersControllers.createReqOthers
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
  othersControllers.updateReqOthers
);

router.patch(
  "/request/:pid",
  [check("status").not().isEmpty()],
  othersControllers.statusUpdateOthers
);

router.delete("/:pid", othersControllers.deleteOthers);

module.exports = router;
