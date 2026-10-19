const { Schema, model } = require("mongoose");

// One document per sequence. _id "student" drives the NXD-YYYY-0001 numbers.
module.exports = model("Counter", new Schema({ _id: String, seq: { type: Number, default: 0 } }));