// const fs = require("fs");

const { validationResult } = require("express-validator");
// const mongoose = require("mongoose");

const HttpError = require("../models/http-error");
const Inverter = require("../models/inverter");
const InverterReq = require("../models/inverter-req");
const moment = require("moment-timezone");

const getInverters = async (req, res, next) => {
  let inverters;
  try {
    inverters = await Inverter.find();
  } catch (err) {
    const error = new HttpError(
      "Fetching inverters failed, please try again later.",
      500
    );
    return next(error);
  }
  res.json({
    inverters: inverters.map((user) => user.toObject({ getters: true })),
  });
};

const getInverterReqs = async (req, res, next) => {
  let inverters;
  try {
    inverters = await InverterReq.find();
  } catch (err) {
    const error = new HttpError(
      "Fetching inverters failed, please try again later.",
      500
    );
    return next(error);
  }
  res.json({
    inverter: inverters.map((user) => user.toObject({ getters: true })),
  });
};

const getInverterById = async (req, res, next) => {
  const inverterId = req.params.pid;

  let inverter;
  try {
    inverter = await Inverter.findById(inverterId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find a Inverter.",
      500
    );
    return next(error);
  }

  if (!inverter) {
    const error = new HttpError(
      "Could not find Inverter for the provided id.",
      404
    );
    return next(error);
  }

  res.json({ inverter: inverter.toObject({ getters: true }) });
};

const createInverter = async (req, res, next) => {
  console.log(req.body);
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
    inverterName,
    type,
    inputVoltage,
    efficiency,
    wattage,
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

  const createdInverter = new Inverter({
    inverterName,
    type,
    inputVoltage,
    efficiency,
    wattage,
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
  //     "Creating Inverter failed, please try again.",
  //     500
  //   );
  //   return next(error);
  // }

  // if (!user) {
  //   const error = new HttpError("Could not find user for provided id.", 404);
  //   return next(error);
  // }

  console.log(createdInverter);

  try {
    // const sess = await mongoose.startSession();
    // sess.startTransaction();
    await createdInverter.save();
    // user.Inverters.push(createdInverter);
    // await user.save({ session: sess });
    // await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      "Creating Inverter failed, please try again.",
      500
    );
    return next(error);
  }

  res.status(201).json({ Inverter: createdInverter });
};

const updateInverter = async (req, res, next) => {
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
    inverterName,
    type,
    inputVoltage,
    efficiency,
    wattage,
    price,
    // img,
    link,
  } = req.body;

  const inverterId = req.params.pid;

  let inverter;
  try {
    inverter = await Inverter.findById(inverterId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not update Inverter.",
      500
    );
    return next(error);
  }

  // if (inverter.creator.toString() !== req.userData.userId) {
  //   const error = new HttpError(
  //     "You are not allowed to edit this Inverter.",
  //     401
  //   );
  //   return next(error);
  // }

  inverter.inverterName = inverterName;
  inverter.type = type;
  inverter.inputVoltage = inputVoltage;
  inverter.efficiency = efficiency;
  inverter.wattage = wattage;
  inverter.price = price;
  // img,
  inverter.link = link;
  inverter.updated_at = datePh;

  try {
    await inverter.save();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not update Inverter.",
      500
    );
    return next(error);
  }

  res.status(200).json({ inverter: inverter.toObject({ getters: true }) });
};

const deleteInverter = async (req, res, next) => {
  const inverterId = req.params.pid;

  if (req.userData.role != "Admin") {
    return next(
      new HttpError("You are not allowed to do this operation.", 403)
    );
  }

  let inverter;
  try {
    inverter = await Inverter.findById(inverterId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not delete Inverter.",
      500
    );
    return next(error);
  }

  if (!inverter) {
    const error = new HttpError("Could not find Inverter for this id.", 404);
    return next(error);
  }

  // if (Inverter.creator.id !== req.userData.userId) {
  //   const error = new HttpError(
  //     "You are not allowed to delete this Inverter.",
  //     401
  //   );
  //   return next(error);
  // }

  // const imagePath = inverter.image;

  try {
    // const sess = await mongoose.startSession();
    // sess.startTransaction();
    // await inverter.remove({ session: sess });
    // inverter.creator.Inverters.pull(inverter);
    // await inverter.creator.save({ session: sess });
    // await sess.commitTransaction();
    await inverter.remove();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not delete Inverter.",
      500
    );
    return next(error);
  }

  // fs.unlink(imagePath, (err) => {
  //   console.log(err);
  // });

  res.status(200).json({ message: "Deleted Inverter." });
};

const createReqInverter = async (req, res, next) => {
  console.log(req.body);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  const datePh = moment.tz(Date.now(), "Asia/Manila").format();
  const {
    inverterName,
    type,
    inputVoltage,
    efficiency,
    wattage,
    price,
    // img,
    link,
  } = req.body;

  const createdInverter = new InverterReq({
    inverterName,
    type,
    inputVoltage,
    efficiency,
    wattage,
    price,
    link,
    // img: req.file.path,
    creator: req.userData.email,
    created_at: datePh,
  });

  try {
    // const sess = await mongoose.startSession();
    // sess.startTransaction();
    await createdInverter.save();
    // user.Inverters.push(createdInverter);
    // await user.save({ session: sess });
    // await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      "Creating Inverter failed, please try again.",
      500
    );
    return next(error);
  }

  console.log(createdInverter);
  res.status(201).json({ Inverter: createdInverter });
};

const updateReqInverter = async (req, res, next) => {
  console.log(req.body);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  const datePh = moment.tz(Date.now(), "Asia/Manila").format();
  const {
    inverterName,
    type,
    inputVoltage,
    efficiency,
    wattage,
    price,
    // img,
    link,
  } = req.body;
  const inverterid = req.params.pid;

  let inverter;
  try {
    inverter = await Inverter.findById(inverterid);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not update Inverter.",
      500
    );
    return next(error);
  }

  const updateInverter = new InverterReq({
    inverterName,
    type,
    inputVoltage,
    efficiency,
    wattage,
    price,
    link,
    id_to_edit: inverterid,
    // img: req.file.path,
    creator: req.userData.email,
    created_at: datePh,
  });

  try {
    // const sess = await mongoose.startSession();
    // sess.startTransaction();
    await updateInverter.save();
    // user.Inverters.push(createdInverter);
    // await user.save({ session: sess });
    // await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      "Creating Inverter failed, please try again.",
      500
    );
    return next(error);
  }

  console.log(updateInverter);
  res.status(201).json({ Inverter: updateInverter });
};

const statusUpdateInverter = async (req, res, next) => {
  if (req.userData.role != "Admin") {
    return next(
      new HttpError("You are not allowed to do this operation.", 403)
    );
  }

  const datePh = moment.tz(Date.now(), "Asia/Manila").format();
  const {
    inverterName,
    type,
    inputVoltage,
    efficiency,
    wattage,
    price,
    // img,
    link,
    status,
  } = req.body;

  const inverterId = req.params.pid;

  let inverter;
  try {
    inverter = await InverterReq.findById(inverterId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not update Inverter Request.",
      500
    );
    return next(error);
  }

  // if (inverter.creator.toString() !== req.userData.userId) {
  //   const error = new HttpError(
  //     "You are not allowed to edit this Inverter.",
  //     401
  //   );
  //   return next(error);
  // }

  inverter.inverterName = inverterName;
  inverter.type = type;
  inverter.inputVoltage = inputVoltage;
  inverter.efficiency = efficiency;
  inverter.wattage = wattage;
  inverter.price = price;
  // img,
  inverter.status = status;
  inverter.link = link;
  inverter.updated_at = datePh;

  try {
    await inverter.save();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not update Inverter Request.",
      500
    );
    return next(error);
  }

  res.status(200).json({ inverter: inverter.toObject({ getters: true }) });
};

exports.getInverters = getInverters;
exports.getInverterReqs = getInverterReqs;
exports.getInverterById = getInverterById;
exports.createInverter = createInverter;
exports.updateInverter = updateInverter;
exports.deleteInverter = deleteInverter;
exports.createReqInverter = createReqInverter;
exports.updateReqInverter = updateReqInverter;
exports.statusUpdateInverter = statusUpdateInverter;
