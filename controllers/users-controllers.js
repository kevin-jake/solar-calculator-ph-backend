const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const HttpError = require("../models/http-error");
const User = require("../models/user");
const moment = require("moment-timezone");

const getUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find({}, "-password");
  } catch (err) {
    const error = new HttpError(
      "Fetching users failed, please try again later.",
      500
    );
    return next(error);
  }
  res.json({ users: users.map((user) => user.toObject({ getters: true })) });
};

const signup = async (req, res, next) => {
  console.log(req.body);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  const { name, email, password, role } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError(
      "Signing up failed, please try again later.",
      500
    );
    return next(error);
  }

  if (existingUser) {
    const error = new HttpError(
      "User exists already, please login instead.",
      422
    );
    return next(error);
  }

  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (err) {
    const error = new HttpError(
      "Could not create user, please try again.",
      500
    );
    return next(error);
  }

  const datePh = moment.tz(Date.now(), "Asia/Manila").format();
  const createdUser = new User({
    name,
    email,
    role,
    // image: req.file.path,
    password: hashedPassword,
    created_at: datePh,
  });

  try {
    await createdUser.save();
  } catch (err) {
    const error = new HttpError(
      "Signing up failed, please try again later.",
      500
    );
    return next(error);
  }

  let token;
  try {
    token = jwt.sign(
      { userId: createdUser.id, email: createdUser.email },
      "supersecret_dont_share",
      { expiresIn: "1h" }
    );
  } catch (err) {
    const error = new HttpError(
      "Signing up failed, please try again later.",
      500
    );
    return next(error);
  }

  console.log("Signup Success");

  res.status(201).json({
    userId: createdUser.id,
    email: createdUser.email,
    role: createdUser.role,
    token: token,
  });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  let existingUser;

  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError(
      "Logging in failed, please try again later.",
      500
    );
    return next(error);
  }

  if (!existingUser) {
    const error = new HttpError(
      "Invalid credentials, could not log you in.",
      403
    );
    return next(error);
  }

  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(password, existingUser.password);
  } catch (err) {
    const error = new HttpError(
      "Could not log you in, please check your credentials and try again.",
      500
    );
    return next(error);
  }

  if (!isValidPassword) {
    const error = new HttpError(
      "Invalid credentials, could not log you in.",
      403
    );
    return next(error);
  }

  let token;
  try {
    token = jwt.sign(
      { userId: existingUser.id, email: existingUser.email },
      "supersecret_dont_share",
      { expiresIn: "1h" }
    );
  } catch (err) {
    const error = new HttpError(
      "Logging in failed, please try again later.",
      500
    );
    return next(error);
  }
  console.log("Login Success");
  console.log(existingUser);
  const response = {
    userId: existingUser.id,
    email: existingUser.email,
    name: existingUser.name,
    role: existingUser.role,
    token: token,
  };
  console.log(response);
  res.json(response);
};

const save = async (req, res, next) => {
  const { uid, data } = req.body;
  const datePh = moment.tz(Date.now(), "Asia/Manila").format();
  console.log(req.body);
  let existingUser;
  try {
    existingUser = await User.findById(uid);
  } catch (err) {
    const error = new HttpError(
      "Logging in failed, please try again later.",
      500
    );
    return next(error);
  }

  existingUser.data = data;
  existingUser.data.updated_at = datePh;

  try {
    await existingUser.save();
  } catch (err) {
    const error = new HttpError("Saving failed, please try again later.", 500);
    return next(error);
  }

  res.status(200).json({
    id: existingUser.id,
    name: existingUser.name,
    email: existingUser.email,
    data: existingUser.data,
  });
};

const getUsersById = async (req, res, next) => {
  const userId = req.params.uid;
  console.log(req.params);
  let user;
  try {
    user = await User.findById(userId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find the User.",
      500
    );
    return next(error);
  }

  if (!user) {
    const error = new HttpError(
      "Could not find User for the provided uid.",
      404
    );
    return next(error);
  }

  res.json({ user: user.toObject({ getters: true }) });
};

exports.getUsers = getUsers;
exports.getUsersById = getUsersById;
exports.signup = signup;
exports.login = login;
exports.save = save;
