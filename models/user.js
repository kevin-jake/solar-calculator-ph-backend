const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, minlength: 6 },
  mobile_num: { type: String, required: true },
  created_at: { type: String },
  updated_at: { type: String },
  data: { type: Object },
  role: { type: String },
  // image: { type: String, required: true },
  // inverters: [
  //   { type: mongoose.Types.ObjectId, required: true, ref: "Inverter" },
  // ],
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema);
