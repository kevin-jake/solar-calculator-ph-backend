const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const batterySchema = new Schema({
  battname: { type: String, required: true },
  batttype: { type: String, required: true },
  battmodel: { type: String },
  voltage: { type: Number, required: true },
  battcapacity: { type: Number, required: true },
  priceperpc: { type: Number, required: true },
  img: { type: String },
  link: { type: String, required: true },
  creator: { type: String, required: true },
  id_to_edit: { type: String },
  created_at: { type: String },
  updated_at: { type: String },
});

module.exports = mongoose.model("Battery-Req", batterySchema);
