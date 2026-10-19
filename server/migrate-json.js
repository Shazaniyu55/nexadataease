// One-off: copy students from the old data.json into MongoDB.  Run: node migrate-json.js
require("dotenv").config();
const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const Student = require("./models/Student");
const Counter = require("./models/Counter");
const Setting = require("./models/Setting");

(async () => {
  const file = path.join(__dirname, "data.json");
  if (!fs.existsSync(file)) { console.log("No data.json found, nothing to import."); process.exit(0); }
  const old = JSON.parse(fs.readFileSync(file));
  await mongoose.connect(process.env.MONGODB_URI || "mongodb+srv://shazaniyu_db_user:9ZJ2BFmTrWYfP8gD@cluster0.lh8bzsp.mongodb.net/");

  let n = 0;
  for (const s of old.students) {
    if (await Student.exists({ studentId: s.studentId })) continue;
    await Student.create({
      ...s,
      cbtAttempts: (s.cbtAttempts || []).map((a) => ({ ...a, date: new Date(a.date) })),
      createdAt: new Date(s.createdAt),
    });
    n++;
  }
  await Counter.updateOne({ _id: "student" }, { $max: { seq: old.counter || 0 } }, { upsert: true });
  if (old.settings) await Setting.updateOne({ _id: "main" }, { cbtOpen: !!old.settings.cbtOpen }, { upsert: true });
  console.log(`Imported ${n} student(s).`);
  await mongoose.disconnect();
})().catch((e) => { console.error(e); process.exit(1); });