const { Schema, model } = require("mongoose");

// Single document with _id "main" holding site-wide switches.
module.exports = model("Setting", new Schema({ _id: String, cbtOpen: { type: Boolean, default: false } }));