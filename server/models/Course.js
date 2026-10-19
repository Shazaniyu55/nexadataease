const { Schema, model } = require("mongoose");
const fileSchema = require("./fileSchema");

const lesson = new Schema({ title: { type: String, required: true, trim: true }, file: fileSchema });

module.exports = model("Course", new Schema(
  {
    instructor: { type: Schema.Types.ObjectId, ref: "Instructor", required: true, index: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    category: String,
    level: String,
    price: { type: Number, required: true }, // naira
    thumbnail: { type: fileSchema, default: null },
    lessons: { type: [lesson], default: [] },
    published: { type: Boolean, default: false },
  },
  { timestamps: true }
));