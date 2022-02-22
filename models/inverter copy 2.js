const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const inverterSchema = new Schema({
  inverterName: { type: String, required: true },
  type: { type: String },
  inputVoltage: { type: Number, required: true },
  efficiency: { type: Number, required: true },
  wattage: { type: Number, required: true },
  price: { type: Number, required: true },
  img: { type: String },
  link: { type: String, required: true },
  creator: { type: String, required: true },
});

module.exports = mongoose.model("Inverter", inverterSchema);
