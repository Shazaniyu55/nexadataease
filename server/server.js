if (!process.env.VERCEL) require("dns").setServers(["8.8.8.8", "1.1.1.1"]);require("dotenv").config();
const express = require("express");
const cors = require("cors");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const mongoose = require("mongoose");
const Student = require("./models/Student");
const Counter = require("./models/Counter");
const Setting = require("./models/Setting");
const QUESTIONS = require("./questions");

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://shazaniyu_db_user:9ZJ2BFmTrWYfP8gD@cluster0.lh8bzsp.mongodb.net/";
const SECRET = process.env.JWT_SECRET;
if (!SECRET) { console.error("Set JWT_SECRET in server/.env"); process.exit(1); }
const ORIGINS = (process.env.CLIENT_ORIGIN || "http://localhost:3000").split(",").map((s) => s.trim());
const CLIENT_URL = ORIGINS[0] === "*" ? "http://localhost:3000" : ORIGINS[0];
const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || "").toLowerCase();
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "";

const CBT_MINUTES = 10, MAX_ATTEMPTS = 2, PASS_MARK = 50, GRACE_MS = 60 * 1000;

const app = express();
app.set("trust proxy", 1);
app.use(cors({ origin: ORIGINS.includes("*") ? true : ORIGINS }));
//app.use(express.json());
app.use(express.json({ verify: (req, res, buf) => { req.rawBody = buf; } })); // rawBody is needed to check Paystack webhook signatures

/* course id -> number of lessons. Keep in sync with lib/courses.js on the frontend. */
const LESSON_COUNT = { web: 6, data: 6, mobile: 6, uiux: 6 };

/* ---- helpers ---- */
const h = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); // forward async errors
// Serverless-friendly: connect once per warm instance and reuse the connection.
let dbReady;
const connectDb = () =>
  dbReady || (dbReady = mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 8000 }).catch((e) => { dbReady = null; throw e; }));
app.use(h(async (req, res, next) => { await connectDb(); next(); }));

const sha = (s) => crypto.createHash("sha256").update(String(s)).digest("hex");
const safeEq = (a, b) => crypto.timingSafeEqual(Buffer.from(sha(a)), Buffer.from(sha(b)));
const toPublic = (s) => ({
  studentId: s.studentId, name: s.name, email: s.email, phone: s.phone,
  course: s.course, progress: s.progress, createdAt: s.createdAt,
});
const sign = (s) => jwt.sign({ id: s.studentId }, SECRET, { expiresIn: "7d" });
const isCbtOpen = async () => !!((await Setting.findById("main").lean()) || {}).cbtOpen;
const findMe = (req) => Student.findOne({ studentId: req.user.id });

const hits = new Map(); // simple in-memory rate limiter
const limit = (max = 10, ms = 15 * 60 * 1000) => (req, res, next) => {
  const k = req.ip + req.path, now = Date.now();
  const arr = (hits.get(k) || []).filter((t) => now - t < ms);
  if (arr.length >= max) return res.status(429).json({ error: "Too many attempts. Please try again later." });
  arr.push(now); hits.set(k, arr); next();
};

const mailer = process.env.SMTP_HOST
  ? nodemailer.createTransport({
      host: process.env.SMTP_HOST, port: Number(process.env.SMTP_PORT || 587),
      secure: Number(process.env.SMTP_PORT) === 465,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    })
  : null;
async function sendMail(to, subject, text) {
  if (!mailer) { console.log(`\n[mail to ${to}] ${subject}\n${text}\n`); return; }
  await mailer.sendMail({ from: process.env.MAIL_FROM || process.env.SMTP_USER, to, subject, text });
}

function auth(req, res, next) {
  try {
    req.user = jwt.verify((req.headers.authorization || "").replace("Bearer ", ""), SECRET);
    if (!req.user.id) throw new Error("not a student");
    next();
  } catch { res.status(401).json({ error: "Please log in again." }); }
}
function adminAuth(req, res, next) {
  try {
    const u = jwt.verify((req.headers.authorization || "").replace("Bearer ", ""), SECRET);
    if (u.role !== "admin") throw new Error("not admin");
    next();
  } catch { res.status(401).json({ error: "Admin login required." }); }
}

/* ================= students ================= */
app.get("/api/health", (req, res) => res.json({ ok: true, db: mongoose.connection.readyState === 1 }));

app.post("/api/register", limit(20), h(async (req, res) => {
  const { name, email, phone, password, course } = req.body || {};
  if (!name || !email || !password || !course) return res.status(400).json({ error: "Name, email, password and course are required." });
  if (!/^\S+@\S+\.\S+$/.test(email)) return res.status(400).json({ error: "Enter a valid email address." });
  if (password.length < 6) return res.status(400).json({ error: "Password must be at least 6 characters." });
  if (!LESSON_COUNT[course]) return res.status(400).json({ error: "Invalid course." });

  const mail = email.trim().toLowerCase();
  if (await Student.exists({ email: mail })) return res.status(409).json({ error: "This email is already registered." });

  // atomic counter: two people registering at once can never get the same ID
  const { seq } = await Counter.findOneAndUpdate({ _id: "student" }, { $inc: { seq: 1 } }, { new: true, upsert: true });
  try {
    const student = await Student.create({
      studentId: `NXD-${new Date().getFullYear()}-${String(seq).padStart(4, "0")}`,
      name, email: mail, phone: phone || "", password: bcrypt.hashSync(password, 10), course,
    });
    res.status(201).json({ token: sign(student), student: toPublic(student) });
  } catch (e) {
    if (e.code === 11000) return res.status(409).json({ error: "This email is already registered." });
    throw e;
  }
}));

app.post("/api/login", limit(15), h(async (req, res) => {
  const { login, password } = req.body || {};
  const key = String(login || "").trim();
  const s = key && await Student.findOne({ $or: [{ email: key.toLowerCase() }, { studentId: key.toUpperCase() }] });
  if (!s || !bcrypt.compareSync(password || "", s.password))
    return res.status(401).json({ error: "Invalid email/student ID or password." });
  res.json({ token: sign(s), student: toPublic(s) });
}));

app.get("/api/me", auth, h(async (req, res) => {
  const s = await findMe(req);
  if (!s) return res.status(404).json({ error: "Student not found." });
  res.json(toPublic(s));
}));

app.post("/api/progress", auth, h(async (req, res) => {
  const i = Number(req.body && req.body.lesson);
  const s = await findMe(req);
  if (!s) return res.status(404).json({ error: "Student not found." });
  if (!Number.isInteger(i) || i < 0 || i >= LESSON_COUNT[s.course]) return res.status(400).json({ error: "Invalid lesson." });
  s.progress = s.progress.includes(i) ? s.progress.filter((n) => n !== i) : [...s.progress, i].sort((a, b) => a - b);
  await s.save();
  res.json(toPublic(s));
}));

/* ================= password reset ================= */
app.post("/api/forgot", limit(5), h(async (req, res) => {
  const mail = String((req.body && req.body.email) || "").trim().toLowerCase();
  const s = mail && await Student.findOne({ email: mail });
  if (s) {
    const token = crypto.randomBytes(32).toString("hex");
    s.reset = { hash: sha(token), expires: Date.now() + 60 * 60 * 1000 };
    await s.save();
    const link = `${CLIENT_URL}/training/reset?email=${encodeURIComponent(mail)}&token=${token}`;
    try {
      await sendMail(mail, "Reset your NexaDataEase Training password",
        `Hello ${s.name},\n\nUse this link to set a new password (valid for 1 hour):\n${link}\n\nIf you did not ask for this, ignore this email.`);
    } catch (e) { console.error("Mail failed:", e.message); }
  }
  res.json({ ok: true }); // same answer whether or not the email exists
}));

app.post("/api/reset", limit(10), h(async (req, res) => {
  const { email, token, password } = req.body || {};
  if (!email || !token || !password || password.length < 6) return res.status(400).json({ error: "Enter a password of at least 6 characters." });
  const s = await Student.findOne({ email: String(email).toLowerCase() });
  const ok = s && s.reset && s.reset.expires > Date.now() && safeEq(s.reset.hash, sha(token));
  if (!ok) return res.status(400).json({ error: "This reset link is invalid or has expired." });
  s.password = bcrypt.hashSync(password, 10);
  s.reset = null;
  await s.save();
  res.json({ ok: true });
}));

/* ================= CBT ================= */
const publicQs = (course) => QUESTIONS[course].map(({ q, options }) => ({ q, options }));

function grade(course, answers) {
  const qs = QUESTIONS[course];
  const score = qs.filter((q, i) => answers[i] === q.answer).length;
  const pct = Math.round((score / qs.length) * 100);
  return { score, total: qs.length, pct, passed: pct >= PASS_MARK, date: new Date() };
}

// closes a test left open past its deadline (+grace) with a score of zero; returns the fresh student
async function settle(s) {
  if (s.cbtActive && Date.now() > s.cbtActive.deadline + GRACE_MS) {
    const claimed = await Student.findOneAndUpdate({ _id: s._id, cbtActive: { $ne: null } }, { $set: { cbtActive: null } });
    if (claimed) await Student.updateOne({ _id: s._id }, { $push: { cbtAttempts: grade(s.course, []) } });
    return Student.findById(s._id);
  }
  return s;
}

app.get("/api/cbt", auth, h(async (req, res) => {
  let s = await findMe(req);
  if (!s) return res.status(404).json({ error: "Student not found." });
  s = await settle(s);
  res.json({
    open: await isCbtOpen(), minutes: CBT_MINUTES, maxAttempts: MAX_ATTEMPTS, passMark: PASS_MARK,
    attempts: s.cbtAttempts,
    active: s.cbtActive ? { deadline: s.cbtActive.deadline, questions: publicQs(s.course) } : null,
  });
}));

app.post("/api/cbt/start", auth, h(async (req, res) => {
  let s = await findMe(req);
  if (!s) return res.status(404).json({ error: "Student not found." });
  s = await settle(s);
  if (!(await isCbtOpen())) return res.status(403).json({ error: "The CBT is not open yet." });
  if (!s.cbtActive) {
    if (s.cbtAttempts.length >= MAX_ATTEMPTS) return res.status(400).json({ error: "You have used all your attempts." });
    s.cbtActive = { deadline: Date.now() + CBT_MINUTES * 60 * 1000 };
    await s.save();
  }
  res.json({ deadline: s.cbtActive.deadline, questions: publicQs(s.course) }); // resumes if already started
}));

app.post("/api/cbt/submit", auth, h(async (req, res) => {
  // atomically claim the active test so a double-click cannot record two attempts
  const s = await Student.findOneAndUpdate(
    { studentId: req.user.id, cbtActive: { $ne: null } }, { $set: { cbtActive: null } }, { new: false });
  if (!s) return res.status(400).json({ error: "No test in progress." });
  const late = Date.now() > s.cbtActive.deadline + GRACE_MS;
  const answers = Array.isArray(req.body && req.body.answers) && !late ? req.body.answers : [];
  const result = grade(s.course, answers);
  await Student.updateOne({ _id: s._id }, { $push: { cbtAttempts: result } });
  res.json(result);
}));

/* ================= admin ================= */
app.post("/api/admin/login", limit(10), (req, res) => {
  const { email, password } = req.body || {};
  const ok = ADMIN_EMAIL && ADMIN_PASSWORD &&
    safeEq(String(email || "").toLowerCase(), ADMIN_EMAIL) && safeEq(String(password || ""), ADMIN_PASSWORD);
  if (!ok) return res.status(401).json({ error: "Invalid admin credentials." });
  res.json({ token: jwt.sign({ role: "admin" }, SECRET, { expiresIn: "12h" }) });
});

app.get("/api/admin/students", adminAuth, h(async (req, res) => {
  const students = await Student.find().sort({ createdAt: 1 });
  res.json({
    cbtOpen: await isCbtOpen(),
    students: students.map((s) => ({
      ...toPublic(s),
      progressPct: Math.round((s.progress.length / LESSON_COUNT[s.course]) * 100),
      attempts: s.cbtAttempts.length,
      bestScore: s.cbtAttempts.length ? Math.max(...s.cbtAttempts.map((a) => a.pct)) : null,
    })),
  });
}));

app.post("/api/admin/cbt", adminAuth, h(async (req, res) => {
  const doc = await Setting.findByIdAndUpdate("main", { cbtOpen: !!(req.body && req.body.open) }, { new: true, upsert: true });
  res.json({ cbtOpen: doc.cbtOpen });
}));

/* ---- instructors, courses, Cloudinary, Paystack ---- */
require("./marketplace")(app, { h, limit, auth, adminAuth, sendMail, SECRET, CLIENT_URL });
/* ---- errors + start ---- */
app.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
  console.error(err);
  res.status(500).json({ error: "Server error. Please try again." });
});

module.exports = app; // Vercel imports this (see api/index.js)

if (require.main === module) { // `npm run dev` / `npm start` locally
  connectDb()
    .then(() => app.listen(PORT, () => console.log(`Training API on http://localhost:${PORT} (MongoDB connected)`)))
    .catch((e) => { console.error("MongoDB connection failed:", e.message); process.exit(1); });
}