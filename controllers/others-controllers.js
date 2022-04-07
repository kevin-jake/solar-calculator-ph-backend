// const fs = require("fs");

const { validationResult } = require("express-validator");
// const mongoose = require("mongoose");

const HttpError = require("../models/http-error");
const Others = require("../models/others");
const Otherreq = require("../models/others-req");
const moment = require("moment-timezone");

const getOthers = async (req, res, next) => {
  let others;
  try {
    others = await Others.find();
  } catch (err) {
    const error = new HttpError(
      "Fetching failed, please try again later.",
      500
    );
    return next(error);
  }
  res.json({
    sccs: sccs.map((user) => user.toObject({ getters: true })),
  });
};

const getOthersReqs = async (req, res, next) => {
  let sccs;
  try {
    sccs = await OthersReq.find();
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

const getOthersById = async (req, res, next) => {
  const sccId = req.params.pid;

  let scc;
  try {
    scc = await Others.findById(sccId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find a Others.",
      500
    );
    return next(error);
  }

  if (!scc) {
    const error = new HttpError(
      "Could not find Others for the provided id.",
      404
    );
    return next(error);
  }

  res.json({ scc: scc.toObject({ getters: true }) });
};

const createOthers = async (req, res, next) => {
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

  const createdOthers = new Others({
    sccname,
    type,
    brand: brand || "",
    supplier: supplier || "",
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
  //     "Creating Others failed, please try again.",
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
    await createdOthers.save();
    // user.Others.push(createdOthers);
    // await user.save({ session: sess });
    // await sess.commitTransaction();
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      "Creating Others failed, please try again.",
      500
    );
    return next(error);
  }

  res.status(201).json({ scc: createdOthers });
};

const updateOthers = async (req, res, next) => {
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
    scc = await Others.findById(sccId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not update Others.",
      500
    );
    return next(error);
  }

  // if (scc.creator.toString() !== req.userData.userId) {
  //   const error = new HttpError(
  //     "You are not allowed to edit this Others.",
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
      "Something went wrong, could not update Others.",
      500
    );
    return next(error);
  }

  res.status(200).json({ scc: scc.toObject({ getters: true }) });
};

const deleteOthers = async (req, res, next) => {
  const sccId = req.params.pid;

  if (req.userData.role != "Admin") {
    return next(
      new HttpError("You are not allowed to do this operation.", 403)
    );
  }

  let scc;
  try {
    scc = await Others.findById(sccId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not delete Others.",
      500
    );
    return next(error);
  }

  if (!scc) {
    const error = new HttpError("Could not find Others for this id.", 404);
    return next(error);
  }

  // if (Others.creator.id !== req.userData.userId) {
  //   const error = new HttpError(
  //     "You are not allowed to delete this Others.",
  //     401
  //   );
  //   return next(error);
  // }

  // const imagePath = scc.image;

  try {
    // const sess = await mongoose.startSession();
    // sess.startTransaction();
    // await scc.remove({ session: sess });
    // scc.creator.Others.pull(scc);
    // await scc.creator.save({ session: sess });
    // await sess.commitTransaction();
    await scc.remove();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not delete Others.",
      500
    );
    return next(error);
  }

  // fs.unlink(imagePath, (err) => {
  //   console.log(err);
  // });

  res.status(200).json({ message: "Deleted Others." });
};

const createReqOthers = async (req, res, next) => {
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

  const createdOthersReq = new OthersReq({
    sccname,
    type,
    brand: brand || "",
    supplier: supplier || "",
    amprating,
    price,
    link,
    // img: req.file.path,
    status: "Request",
    creator: req.userData.email,
    created_at: datePh,
  });

  console.log(createdOthersReq);

  try {
    // const sess = await mongoose.startSession();
    // sess.startTransaction();
    await createdOthersReq.save();
    // user.Others.push(createdOthers);
    // await user.save({ session: sess });
    // await sess.commitTransaction();
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      "Creating Others failed, please try again.",
      500
    );
    return next(error);
  }

  res.status(201).json({ scc: createdOthersReq });
};

const updateReqOthers = async (req, res, next) => {
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
    scc = await Others.findById(sccId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not update Others.",
      500
    );
    return next(error);
  }

  const updateOthersReq = new OthersReq({
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

  console.log(updateOthersReq);

  try {
    // const sess = await mongoose.startSession();
    // sess.startTransaction();
    await updateOthersReq.save();
    // user.Others.push(createdOthers);
    // await user.save({ session: sess });
    // await sess.commitTransaction();
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      "Updating Others failed, please try again.",
      500
    );
    return next(error);
  }

  res.status(201).json({ scc: updateOthersReq });
};

const statusUpdateOthers = async (req, res, next) => {
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
    scc = await OthersReq.findById(sccId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not update Others Request.",
      500
    );
    return next(error);
  }

  // if (scc.creator.toString() !== req.userData.userId) {
  //   const error = new HttpError(
  //     "You are not allowed to edit this Others.",
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
      "Something went wrong, could not update Others Request.",
      500
    );
    return next(error);
  }

  res.status(200).json({ scc: scc.toObject({ getters: true }) });
};

exports.getOthers = getOthers;
exports.getOthersReqs = getOthersReqs;
exports.getOthersById = getOthersById;
exports.createOthers = createOthers;
exports.updateOthers = updateOthers;
exports.deleteOthers = deleteOthers;
exports.createReqOthers = createReqOthers;
exports.updateReqOthers = updateReqOthers;
exports.statusUpdateOthers = statusUpdateOthers;
