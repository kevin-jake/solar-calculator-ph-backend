const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const batterySchema = new Schema({
  battname: { type: String, required: true },
  batttype: { type: String, required: true },
  battmodel: { type: Number },
  voltage: { type: Number, required: true },
  battcapacity: { type: Number, required: true },
  priceperpc: { type: Number, required: true },
  img: { type: String },
  link: { type: String, required: true },
  creator: { type: String, required: true },
});

module.exports = mongoose.model("Battery", batterySchema);
