const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const otherSchema = new Schema({
  name: { type: String, required: true },
  product_category: { type: String, required: true },
  specifications: { type: Object },
  supplier: { type: String },
  price: { type: Number, required: true },
  img: { type: String },
  link: { type: String, required: true },
  creator: { type: String, required: true },
  modified_by: { type: String },
  approved_by: { type: String },
  created_at: { type: String },
  updated_at: { type: String },
});

module.exports = mongoose.model("Others", otherSchema);
