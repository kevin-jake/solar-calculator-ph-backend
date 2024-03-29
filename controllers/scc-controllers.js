// const fs = require("fs");

const { validationResult } = require("express-validator");
// const mongoose = require("mongoose");

const HttpError = require("../models/http-error");
const SCC = require("../models/scc");
const SCCReq = require("../models/scc-req");
const moment = require("moment-timezone");

const getSCC = async (req, res, next) => {
  let sccs;
  try {
    sccs = await SCC.find();
  } catch (err) {
    const error = new HttpError(
      "Fetching sccs failed, please try again later.",
      500
    );
    return next(error);
  }
  res.json({
    sccs: sccs.map((user) => user.toObject({ getters: true })),
  });
};

const getSCCReqs = async (req, res, next) => {
  let sccs;
  try {
    sccs = await SCCReq.find();
  } catch (err) {
    const error = new HttpError(
      "Fetching sccs failed, please try again later.",
      500
    );
    return next(error);
  }
  res.json({
    scc: sccs.map((user) => user.toObject({ getters: true })),
  });
};

const getSCCById = async (req, res, next) => {
  const sccId = req.params.pid;

  let scc;
  try {
    scc = await SCC.findById(sccId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find a SCC.",
      500
    );
    return next(error);
  }

  if (!scc) {
    const error = new HttpError("Could not find SCC for the provided id.", 404);
    return next(error);
  }

  res.json({ scc: scc.toObject({ getters: true }) });
};

const createSCC = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  console.log(req.userData.role);

  if (req.userData.role != "Admin") {
    return next(
      new HttpError("You are not allowed to do this operation.", 403)
    );
  }

  const datePh = moment.tz(Date.now(), "Asia/Manila").format();
  const {
    sccname,
    type,
    brand,
    supplier,
    amprating,
    price,
    // img,
    link,
  } = req.body;

  let requestor;
  if (req.body.creator) {
    requestor = req.body.creator;
  } else {
    requestor = req.userData.email;
  }

  const createdSCC = new SCC({
    sccname,
    type,
    brand,
    supplier,
    amprating,
    price,
    link,
    // img: req.file.path,
    creator: requestor,
    approved_by: null || req.userData.email,
    created_at: datePh,
  });

  // let user;
  // try {
  //   user = await User.findById(req.userData.userId);
  // } catch (err) {
  //   const error = new HttpError(
  //     "Creating SCC failed, please try again.",
  //     500
  //   );
  //   return next(error);
  // }

  // if (!user) {
  //   const error = new HttpError("Could not find user for provided id.", 404);
  //   return next(error);
  // }

  try {
    // const sess = await mongoose.startSession();
    // sess.startTransaction();
    await createdSCC.save();
    // user.SCC.push(createdSCC);
    // await user.save({ session: sess });
    // await sess.commitTransaction();
  } catch (err) {
    console.log(err);
    const error = new HttpError("Creating SCC failed, please try again.", 500);
    return next(error);
  }

  res.status(201).json({ scc: createdSCC });
};

const updateSCC = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  if (req.userData.role != "Admin") {
    return next(
      new HttpError("You are not allowed to do this operation.", 403)
    );
  }

  const datePh = moment.tz(Date.now(), "Asia/Manila").format();
  const {
    sccname,
    type,
    brand,
    supplier,
    amprating,
    price,
    // img,
    link,
  } = req.body;
  const sccId = req.params.pid;

  let scc;
  try {
    scc = await SCC.findById(sccId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not update SCC.",
      500
    );
    return next(error);
  }

  // if (scc.creator.toString() !== req.userData.userId) {
  //   const error = new HttpError(
  //     "You are not allowed to edit this SCC.",
  //     401
  //   );
  //   return next(error);
  // }

  scc.sccname = sccname;
  scc.type = type;
  scc.brand = brand;
  scc.supplier = supplier;
  scc.amprating = amprating;
  scc.price = price;
  // img,
  scc.link = link;
  scc.updated_at = datePh;
  scc.approved_by = req.userData.email;

  try {
    await scc.save();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not update SCC.",
      500
    );
    return next(error);
  }

  res.status(200).json({ scc: scc.toObject({ getters: true }) });
};

const deleteSCC = async (req, res, next) => {
  const sccId = req.params.pid;

  if (req.userData.role != "Admin") {
    return next(
      new HttpError("You are not allowed to do this operation.", 403)
    );
  }

  let scc;
  try {
    scc = await SCC.findById(sccId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not delete SCC.",
      500
    );
    return next(error);
  }

  if (!scc) {
    const error = new HttpError("Could not find SCC for this id.", 404);
    return next(error);
  }

  // if (SCC.creator.id !== req.userData.userId) {
  //   const error = new HttpError(
  //     "You are not allowed to delete this SCC.",
  //     401
  //   );
  //   return next(error);
  // }

  // const imagePath = scc.image;

  try {
    // const sess = await mongoose.startSession();
    // sess.startTransaction();
    // await scc.remove({ session: sess });
    // scc.creator.SCC.pull(scc);
    // await scc.creator.save({ session: sess });
    // await sess.commitTransaction();
    await scc.remove();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not delete SCC.",
      500
    );
    return next(error);
  }

  // fs.unlink(imagePath, (err) => {
  //   console.log(err);
  // });

  res.status(200).json({ message: "Deleted SCC." });
};

const createReqSCC = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  const datePh = moment.tz(Date.now(), "Asia/Manila").format();
  const {
    sccname,
    type,
    brand,
    supplier,
    amprating,
    price,
    // img,
    link,
  } = req.body;

  const createdSCCReq = new SCCReq({
    sccname,
    type,
    brand,
    supplier,
    amprating,
    price,
    link,
    // img: req.file.path,
    status: "Request",
    creator: req.userData.email,
    created_at: datePh,
  });

  console.log(createdSCCReq);

  try {
    // const sess = await mongoose.startSession();
    // sess.startTransaction();
    await createdSCCReq.save();
    // user.SCC.push(createdSCC);
    // await user.save({ session: sess });
    // await sess.commitTransaction();
  } catch (err) {
    console.log(err);
    const error = new HttpError("Creating SCC failed, please try again.", 500);
    return next(error);
  }

  res.status(201).json({ scc: createdSCCReq });
};

const updateReqSCC = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  const datePh = moment.tz(Date.now(), "Asia/Manila").format();
  const {
    sccname,
    type,
    brand,
    supplier,
    amprating,
    price,
    // img,
    link,
  } = req.body;
  const sccId = req.params.pid;

  let scc;
  try {
    scc = await SCC.findById(sccId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not update SCC.",
      500
    );
    return next(error);
  }

  const updateSCCReq = new SCCReq({
    sccname,
    type,
    brand,
    supplier,
    amprating,
    price,
    link,
    id_to_edit: sccId,
    // img: req.file.path,
    status: "Request",
    creator: req.userData.email,
    created_at: datePh,
  });

  console.log(updateSCCReq);

  try {
    // const sess = await mongoose.startSession();
    // sess.startTransaction();
    await updateSCCReq.save();
    // user.SCC.push(createdSCC);
    // await user.save({ session: sess });
    // await sess.commitTransaction();
  } catch (err) {
    console.log(err);
    const error = new HttpError("Updating SCC failed, please try again.", 500);
    return next(error);
  }

  res.status(201).json({ scc: updateSCCReq });
};

const statusUpdateSCC = async (req, res, next) => {
  if (req.userData.role != "Admin") {
    return next(
      new HttpError("You are not allowed to do this operation.", 403)
    );
  }

  const datePh = moment.tz(Date.now(), "Asia/Manila").format();
  const {
    sccname,
    type,
    brand,
    supplier,
    amprating,
    price,
    // img,
    link,
    status,
  } = req.body;
  const sccId = req.params.pid;

  let scc;
  try {
    scc = await SCCReq.findById(sccId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not update SCC Request.",
      500
    );
    return next(error);
  }

  // if (scc.creator.toString() !== req.userData.userId) {
  //   const error = new HttpError(
  //     "You are not allowed to edit this SCC.",
  //     401
  //   );
  //   return next(error);
  // }

  scc.sccname = sccname;
  scc.type = type;
  scc.brand = brand;
  scc.supplier = supplier;
  scc.amprating = amprating;
  scc.price = price;
  // img,
  scc.status = status;
  scc.link = link;
  scc.updated_at = datePh;
  try {
    await scc.save();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not update SCC Request.",
      500
    );
    return next(error);
  }

  res.status(200).json({ scc: scc.toObject({ getters: true }) });
};

exports.getSCC = getSCC;
exports.getSCCReqs = getSCCReqs;
exports.getSCCById = getSCCById;
exports.createSCC = createSCC;
exports.updateSCC = updateSCC;
exports.deleteSCC = deleteSCC;
exports.createReqSCC = createReqSCC;
exports.updateReqSCC = updateReqSCC;
exports.statusUpdateSCC = statusUpdateSCC;
