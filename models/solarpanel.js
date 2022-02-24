const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const solarpanelSchema = new Schema({
  pvname: { type: String, required: true },
  wattage: { type: Number, required: true },
  brand: { type: String },
  supplier: { type: String },
  voc: { type: Number, required: true },
  imp: { type: Number, required: true },
  vmp: { type: Number, required: true },
  isc: { type: Number, required: true },
  price: { type: Number, required: true },
  img: { type: String },
  link: { type: String, required: true },
  creator: { type: String, required: true },
  created_at: { type: String },
  updated_at: { type: String },
});

module.exports = mongoose.model("SolarPanel", solarpanelSchema);
