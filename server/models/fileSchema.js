const { Schema } = require("mongoose");

// A file stored in Cloudinary (we keep only its reference, never the bytes).
module.exports = new Schema(
  { publicId: String, resourceType: String, format: String, bytes: Number, name: String },
  { _id: false }
);