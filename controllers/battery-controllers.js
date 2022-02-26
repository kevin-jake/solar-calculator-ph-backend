// const fs = require("fs");

const { validationResult } = require("express-validator");
// const mongoose = require("mongoose");

const HttpError = require("../models/http-error");
const Battery = require("../models/battery");
const moment = require("moment-timezone");

const getBattery = async (req, res, next) => {
  let battery;
  try {
    battery = await Battery.find();
  } catch (err) {
    const error = new HttpError(
      "Fetching Battery failed, please try again later.",
      500
    );
    return next(error);
  }
  res.json({
    battery: battery.map((user) => user.toObject({ getters: true })),
  });
};

const getBatteryById = async (req, res, next) => {
  const battId = req.params.pid;

  let battery;
  try {
    battery = await Battery.findById(battId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find a Battery.",
      500
    );
    return next(error);
  }

  if (!battery) {
    const error = new HttpError(
      "Could not find Battery for the provided id.",
      404
    );
    return next(error);
  }

  res.json({ battery: battery.toObject({ getters: true }) });
};

const createBattery = async (req, res, next) => {
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
    battname,
    batttype,
    battmodel,
    voltage,
    battcapacity,
    priceperpc,
    // img,
    link,
  } = req.body;

  const createdBattery = new Battery({
    battname,
    batttype,
    battmodel,
    voltage,
    battcapacity,
    priceperpc,
    link,
    // img: req.file.path,
    creator: req.userData.email,
    created_at: datePh,
  });

  let user;
  try {
    user = await User.findById(req.userData.userId);
  } catch (err) {
    const error = new HttpError(
      "Creating Battery failed, please try again.",
      500
    );
    return next(error);
  }

  if (!user) {
    const error = new HttpError("Could not find user for provided id.", 404);
    return next(error);
  }

  try {
    // const sess = await mongoose.startSession();
    // sess.startTransaction();
    await createdBattery.save();
    // user.Battery.push(createdBattery);
    // await user.save({ session: sess });
    // await sess.commitTransaction();
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      "Creating Battery failed, please try again.",
      500
    );
    return next(error);
  }

  res.status(201).json({ battery: createdBattery });
};

const updateBattery = async (req, res, next) => {
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
    battname,
    batttype,
    battmodel,
    voltage,
    battcapacity,
    priceperpc,
    // img,
    link,
  } = req.body;
  const battid = req.params.pid;

  let battery;
  try {
    battery = await Battery.findById(battid);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not update Battery.",
      500
    );
    return next(error);
  }

  // if (inverter.creator.toString() !== req.userData.userId) {
  //   const error = new HttpError(
  //     "You are not allowed to edit this Battery.",
  //     401
  //   );
  //   return next(error);
  // }

  battery.battname = battname;
  battery.batttype = batttype;
  battery.battmodel = battmodel;
  battery.voltage = voltage;
  battery.battcapacity = battcapacity;
  battery.priceperpc = priceperpc;
  // img,
  battery.link = link;
  battery.updated_at = datePh;

  try {
    await battery.save();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not update Battery.",
      500
    );
    return next(error);
  }

  res.status(200).json({ battery: battery.toObject({ getters: true }) });
};

const deleteBattery = async (req, res, next) => {
  const battid = req.params.pid;

  if (req.userData.role != "Admin") {
    return next(
      new HttpError("You are not allowed to do this operation.", 403)
    );
  }

  let battery;
  try {
    battery = await Battery.findById(battid);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not delete Battery.",
      500
    );
    return next(error);
  }

  if (!battery) {
    const error = new HttpError("Could not find Battery for this id.", 404);
    return next(error);
  }

  // if (Battery.creator.id !== req.userData.userId) {
  //   const error = new HttpError(
  //     "You are not allowed to delete this Battery.",
  //     401
  //   );
  //   return next(error);
  // }

  // const imagePath = inverter.image;

  try {
    // const sess = await mongoose.startSession();
    // sess.startTransaction();
    // await inverter.remove({ session: sess });
    // inverter.creator.Battery.pull(inverter);
    // await inverter.creator.save({ session: sess });
    // await sess.commitTransaction();
    await battery.remove();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not delete Battery.",
      500
    );
    return next(error);
  }

  // fs.unlink(imagePath, (err) => {
  //   console.log(err);
  // });

  res.status(200).json({ message: "Deleted Battery." });
};

exports.getBattery = getBattery;
exports.getBatteryById = getBatteryById;
exports.createBattery = createBattery;
exports.updateBattery = updateBattery;
exports.deleteBattery = deleteBattery;
