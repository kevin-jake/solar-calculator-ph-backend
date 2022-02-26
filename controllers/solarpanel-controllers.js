// const fs = require("fs");

const { validationResult } = require("express-validator");
// const mongoose = require("mongoose");

const HttpError = require("../models/http-error");
const SolarPanel = require("../models/solarpanel");
const moment = require("moment-timezone");

const getSolarPanel = async (req, res, next) => {
  let solar_panel;
  try {
    solar_panel = await SolarPanel.find();
  } catch (err) {
    const error = new HttpError(
      "Fetching Solar Panel failed, please try again later.",
      500
    );
    return next(error);
  }
  res.json({
    solar_panel: solar_panel.map((user) => user.toObject({ getters: true })),
  });
};

const getSolarPanelById = async (req, res, next) => {
  const solar_panelId = req.params.pid;

  let solar_panel;
  try {
    solar_panel = await SolarPanel.findById(solar_panelId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find a Solar Panel.",
      500
    );
    return next(error);
  }

  if (!solar_panel) {
    const error = new HttpError(
      "Could not find Solar Panel for the provided id.",
      404
    );
    return next(error);
  }

  res.json({ solar_panel: solar_panel.toObject({ getters: true }) });
};

const createSolarPanel = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  const datePh = moment.tz(Date.now(), "Asia/Manila").format();
  const {
    pvname,
    wattage,
    brand,
    supplier,
    voc,
    imp,
    vmp,
    isc,
    price,
    // img,
    link,
  } = req.body;

  const createdSolarPanel = new SolarPanel({
    pvname,
    wattage,
    brand,
    supplier,
    voc,
    imp,
    vmp,
    isc,
    price,
    // img: req.file.path,
    link,
    creator: req.userData.email,
    created_at: datePh,
  });

  // let user;
  // try {
  //   user = await User.findById(req.userData.userId);
  // } catch (err) {
  //   const error = new HttpError(
  //     "Creating SolarPanel failed, please try again.",
  //     500
  //   );
  //   return next(error);
  // }

  // if (!user) {
  //   const error = new HttpError("Could not find user for provided id.", 404);
  //   return next(error);
  // }

  console.log(createdSolarPanel);

  try {
    // const sess = await mongoose.startSession();
    // sess.startTransaction();
    await createdSolarPanel.save();
    // user.SolarPanels.push(createdSolarPanel);
    // await user.save({ session: sess });
    // await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      "Creating Solar Panel failed, please try again.",
      500
    );
    return next(error);
  }

  res.status(201).json({ solar_panel: createdSolarPanel });
};

const updateSolarPanel = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  const datePh = moment.tz(Date.now(), "Asia/Manila").format();
  const {
    pvname,
    wattage,
    brand,
    supplier,
    voc,
    imp,
    vmp,
    isc,
    price,
    // img,
    link,
  } = req.body;
  const solar_panelId = req.params.pid;

  let solar_panel;
  try {
    solar_panel = await SolarPanel.findById(solar_panelId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not update Solar Panel.",
      500
    );
    return next(error);
  }

  // if (solar_panel.creator.toString() !== req.userData.userId) {
  //   const error = new HttpError(
  //     "You are not allowed to edit this Solar Panel.",
  //     401
  //   );
  //   return next(error);
  // }

  solar_panel.pvname = pvname;
  solar_panel.wattage = wattage;
  solar_panel.brand = brand;
  solar_panel.supplier = supplier;
  solar_panel.voc = voc;
  solar_panel.imp = imp;
  solar_panel.vmp = vmp;
  solar_panel.isc = isc;
  solar_panel.price = price;
  // img,
  solar_panel.link = link;
  solar_panel.updated_at = datePh;

  try {
    await solar_panel.save();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not update Solar Panel.",
      500
    );
    return next(error);
  }

  res
    .status(200)
    .json({ solar_panel: solar_panel.toObject({ getters: true }) });
};

const deleteSolarPanel = async (req, res, next) => {
  const solar_panelId = req.params.pid;

  let solar_panel;
  try {
    solar_panel = await SolarPanel.findById(solar_panelId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not delete Solar Panel.",
      500
    );
    return next(error);
  }

  if (!solar_panel) {
    const error = new HttpError("Could not find SolarPanel for this id.", 404);
    return next(error);
  }

  // if (SolarPanel.creator.id !== req.userData.userId) {
  //   const error = new HttpError(
  //     "You are not allowed to delete this Solar Panel.",
  //     401
  //   );
  //   return next(error);
  // }

  // const imagePath = solar_panel.image;

  try {
    // const sess = await mongoose.startSession();
    // sess.startTransaction();
    // await solar_panel.remove({ session: sess });
    // solar_panel.creator.SolarPanels.pull(solar_panel);
    // await solar_panel.creator.save({ session: sess });
    // await sess.commitTransaction();
    await solar_panel.remove();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not delete Solar Panel.",
      500
    );
    return next(error);
  }

  // fs.unlink(imagePath, (err) => {
  //   console.log(err);
  // });

  res.status(200).json({ message: "Deleted Solar Panel." });
};

exports.getSolarPanel = getSolarPanel;
exports.getSolarPanelById = getSolarPanelById;
exports.createSolarPanel = createSolarPanel;
exports.updateSolarPanel = updateSolarPanel;
exports.deleteSolarPanel = deleteSolarPanel;