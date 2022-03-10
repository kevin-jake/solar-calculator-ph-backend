const express = require("express");
const { check } = require("express-validator");

const sccControllers = require("../controllers/scc-controllers");
// const fileUpload = require("../middleware/file-upload");
const checkAuth = require("../middleware/check-auth");

const router = express.Router();

router.get("/", sccControllers.getSCC);

// router.get("/user/:uid", sccControllers.getSCCByUserId);

router.use(checkAuth);

router.get("/requests", sccControllers.getSCCReqs);
router.get("/:pid", sccControllers.getSCCById);

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
  sccControllers.createSCC
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
  sccControllers.updateSCC
);

router.delete("/:pid", sccControllers.deleteSCC);

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
  sccControllers.createReqSCC
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
  sccControllers.updateReqSCC
);

module.exports = router;
