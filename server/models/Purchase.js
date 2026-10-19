const { Schema, model } = require("mongoose");

const schema = new Schema(
  {
    student: { type: String, required: true, index: true }, // studentId, e.g. NXD-2026-0001
    course: { type: Schema.Types.ObjectId, ref: "Course", required: true },
    instructor: { type: Schema.Types.ObjectId, ref: "Instructor", required: true },
    amount: { type: Number, required: true },          // kobo, fixed at checkout
    instructorShare: { type: Number, required: true }, // kobo
    reference: { type: String, required: true, unique: true },
    status: { type: String, enum: ["pending", "paid"], default: "pending" },
    paidAt: Date,
  },
  { timestamps: true }
);
schema.index({ student: 1, course: 1 });

module.exports = model("Purchase", schema);