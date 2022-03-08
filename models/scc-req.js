const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const sccSchema = new Schema({
  sccname: { type: String, required: true },
  type: { type: String, required: true },
  brand: { type: String },
  supplier: { type: String },
  amprating: { type: Number, required: true },
  price: { type: Number, required: true },
  img: { type: String },
  link: { type: String, required: true },
  creator: { type: String, required: true },
  id_to_edit: { type: String },
  created_at: { type: String },
  updated_at: { type: String },
});

module.exports = mongoose.model("SCC-req", sccSchema);
