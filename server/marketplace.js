// Instructors, courses, Cloudinary uploads and Paystack payments.
// Mounted from server.js:  require("./marketplace")(app, { h, limit, auth, adminAuth, sendMail, SECRET, CLIENT_URL });
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const cloudinary = require("cloudinary").v2;
const Instructor = require("./models/Instructor");
const Course = require("./models/Course");
const Purchase = require("./models/Purchase");
const Student = require("./models/Student");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

const PAYSTACK_KEY = process.env.PAYSTACK_SECRET_KEY || "";
const FEE = Number(process.env.PLATFORM_FEE_PERCENT || 30); // % the platform keeps
const MIN_PRICE = 500; // naira
const CATEGORIES = ["web", "data", "mobile", "uiux", "other"];
const LEVELS = ["beginner", "intermediate", "advanced"];

// what each upload may be: Cloudinary folder, public vs private, and allowed formats (signed, so the browser can't change them)
const PURPOSES = {
  cv: { dir: "docs", type: "authenticated", formats: "pdf,doc,docx" },
  certificate: { dir: "docs", type: "authenticated", formats: "pdf,jpg,jpeg,png" },
  thumbnail: { dir: "thumbs", type: "upload", formats: "jpg,jpeg,png,webp", approved: true },
  lesson: { dir: "lessons", type: "authenticated", formats: "mp4,mov,webm,m4v,pdf", approved: true },
};

const bad = (res, msg, code = 400) => res.status(code).json({ error: msg });
const prefix = (iid, dir) => `nexa/instructors/${iid}/${dir}/`;
const url = (v) => (v ? (/^https?:\/\//i.test(v) ? v : `https://${v}`) : "");

// accept a file reference from the browser only if it sits inside this instructor's own Cloudinary folder
const fileOf = (f, pre) =>
  f && typeof f.publicId === "string" && f.publicId.startsWith(pre)
    ? { publicId: f.publicId, resourceType: ["image", "video", "raw"].includes(f.resourceType) ? f.resourceType : "raw",
        format: String(f.format || ""), bytes: Number(f.bytes) || 0, name: String(f.name || "").slice(0, 120) }
    : null;

const destroy = (f) => f && f.publicId &&
  cloudinary.uploader.destroy(f.publicId, { resource_type: f.resourceType, type: "authenticated", invalidate: true }).catch(() => {});
const viewUrl = (f) => cloudinary.url(f.publicId, { resource_type: f.resourceType, type: "authenticated", sign_url: true, secure: true, format: f.format || undefined });
const downloadUrl = (f) => cloudinary.utils.private_download_url(f.publicId, f.format || "",
  { resource_type: f.resourceType, type: "authenticated", expires_at: Math.round(Date.now() / 1000) + 3600 }); // link dies in 1 hour
const thumbUrl = (c) => (c.thumbnail && c.thumbnail.publicId
  ? cloudinary.url(c.thumbnail.publicId, { secure: true, width: 640, height: 360, crop: "fill", fetch_format: "auto", quality: "auto" }) : null);
const card = (c) => ({
  id: String(c._id), title: c.title, category: c.category, level: c.level, price: c.price, thumbnail: thumbUrl(c),
  lessonCount: c.lessons.length, published: c.published, instructor: c.instructor && c.instructor.name ? c.instructor.name : undefined,
});
const pub = (i) => { const o = i.toObject(); delete o.password; delete o.__v; return o; };

async function paystack(path, method = "GET", body) {
  if (!PAYSTACK_KEY) throw new Error("Paystack is not configured.");
  const r = await fetch(`https://api.paystack.co${path}`, {
    method, headers: { Authorization: `Bearer ${PAYSTACK_KEY}`, "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
  const d = await r.json().catch(() => ({}));
  if (!r.ok || !d.status) throw new Error(d.message || "Paystack request failed.");
  return d.data;
}

// ask Paystack what really happened, then mark the purchase paid only if status, amount and currency all match
async function settle(reference) {
  const p = await Purchase.findOne({ reference });
  if (!p || p.status === "paid") return p;
  const d = await paystack(`/transaction/verify/${encodeURIComponent(reference)}`);
  if (d.status === "success" && d.amount === p.amount && d.currency === "NGN")
    await Purchase.findOneAndUpdate({ _id: p._id, status: { $ne: "paid" } }, { status: "paid", paidAt: new Date() });
  return Purchase.findById(p._id);
}

module.exports = function mount(app, { h, limit, auth, adminAuth, sendMail, SECRET, CLIENT_URL }) {
  const bearer = (req) => (req.headers.authorization || "").replace("Bearer ", "");
  const signI = (i) => jwt.sign({ role: "instructor", iid: String(i._id) }, SECRET, { expiresIn: "7d" });

  function instrAuth(req, res, next) {
    try {
      const u = jwt.verify(bearer(req), SECRET);
      if (u.role !== "instructor") throw new Error("not instructor");
      req.iid = u.iid; next();
    } catch { bad(res, "Please log in again.", 401); }
  }
  const approved = h(async (req, res, next) => {
    const i = await Instructor.findById(req.iid);
    if (!i) return bad(res, "Please log in again.", 401);
    if (i.status !== "approved") return bad(res, "Your application has not been approved yet.", 403);
    next();
  });
  function optStudent(req, res, next) { // logged-in student if there is a valid token, otherwise anonymous
    try { const u = jwt.verify(bearer(req), SECRET); if (u.id) req.user = u; } catch { /* anonymous */ }
    next();
  }
  const ownCourse = async (req, res) => {
    const c = validId(req.params.id) && await Course.findOne({ _id: req.params.id, instructor: req.iid });
    if (!c) bad(res, "Course not found.", 404);
    return c;
  };
  const validId = (id) => mongoose.isValidObjectId(id);

  /* ================= instructor accounts ================= */
  app.post("/api/instructor/register", limit(10), h(async (req, res) => {
    const b = req.body || {};
    const t = (k) => String(b[k] || "").trim();
    for (const k of ["name", "email", "phone", "password", "country", "qualification", "bio"])
      if (!t(k)) return bad(res, "Please fill in all required fields.");
    if (!/^\S+@\S+\.\S+$/.test(t("email"))) return bad(res, "Enter a valid email address.");
    if (t("password").length < 6) return bad(res, "Password must be at least 6 characters.");
    if (t("bio").length < 40) return bad(res, "Tell us a little more about yourself (at least 40 characters).");
    const expertise = (Array.isArray(b.expertise) ? b.expertise : []).filter((x) => CATEGORIES.includes(x));
    if (!expertise.length) return bad(res, "Choose at least one area of expertise.");
    const years = Number(b.yearsExperience);
    if (!(years >= 0 && years <= 60)) return bad(res, "Enter your years of experience.");
    if (b.consent !== true) return bad(res, "Please confirm that your information is accurate.");

    const email = t("email").toLowerCase();
    if (await Instructor.exists({ email })) return bad(res, "This email is already registered.", 409);
    try {
      const i = await Instructor.create({
        name: t("name"), email, phone: t("phone"), password: bcrypt.hashSync(t("password"), 10), country: t("country"),
        qualification: t("qualification"), yearsExperience: years, employer: t("employer"), expertise,
        linkedin: url(t("linkedin")), teachingExperience: t("teachingExperience").slice(0, 1500), bio: t("bio").slice(0, 1500),
      });
      res.status(201).json({ token: signI(i), instructor: pub(i) });
    } catch (e) {
      if (e.code === 11000) return bad(res, "This email is already registered.", 409);
      throw e;
    }
  }));

  app.post("/api/instructor/login", limit(15), h(async (req, res) => {
    const { email, password } = req.body || {};
    const i = await Instructor.findOne({ email: String(email || "").trim().toLowerCase() });
    if (!i || !bcrypt.compareSync(password || "", i.password)) return bad(res, "Invalid email or password.", 401);
    res.json({ token: signI(i), instructor: pub(i) });
  }));

  app.get("/api/instructor/me", instrAuth, h(async (req, res) => {
    const i = await Instructor.findById(req.iid);
    if (!i) return bad(res, "Please log in again.", 401);
    res.json(pub(i));
  }));

  // after uploading to Cloudinary, the instructor submits the file references to complete the application
  app.post("/api/instructor/documents", instrAuth, h(async (req, res) => {
    const i = await Instructor.findById(req.iid);
    if (!i) return bad(res, "Please log in again.", 401);
    if (i.status === "approved") return bad(res, "Your application is already approved.");
    const pre = prefix(req.iid, "docs");
    const cv = fileOf(req.body && req.body.cv, pre);
    if (!cv) return bad(res, "Please upload your CV.");
    const certs = (Array.isArray(req.body.certificates) ? req.body.certificates : []).slice(0, 3).map((f) => fileOf(f, pre)).filter(Boolean);
    i.cv = cv; i.certificates = certs; i.status = "pending"; i.reviewNote = "";
    await i.save();
    if (process.env.ADMIN_EMAIL)
      sendMail(process.env.ADMIN_EMAIL, "New instructor application", `${i.name} (${i.email}) has applied to teach. Review it at ${CLIENT_URL}/training/admin/instructors`).catch(() => {});
    res.json(pub(i));
  }));

  /* ================= Cloudinary signed uploads (the file goes browser -> Cloudinary, never through this server) ================= */
  app.post("/api/uploads/sign", instrAuth, limit(60), h(async (req, res) => {
    const p = PURPOSES[req.body && req.body.purpose];
    if (!p) return bad(res, "Unknown upload type.");
    const i = await Instructor.findById(req.iid);
    if (!i) return bad(res, "Please log in again.", 401);
    if (p.approved && i.status !== "approved") return bad(res, "Your application has not been approved yet.", 403);
    const params = { folder: prefix(req.iid, p.dir).slice(0, -1), type: p.type, allowed_formats: p.formats, timestamp: Math.round(Date.now() / 1000) };
    const cfg = cloudinary.config();
    res.json({ cloudName: cfg.cloud_name, apiKey: cfg.api_key, params, signature: cloudinary.utils.api_sign_request(params, cfg.api_secret) });
  }));

  /* ================= instructor courses ================= */
  app.get("/api/instructor/courses", instrAuth, approved, h(async (req, res) => {
    const courses = await Course.find({ instructor: req.iid }).sort({ createdAt: -1 });
    const stats = await Purchase.aggregate([
      { $match: { instructor: new mongoose.Types.ObjectId(req.iid), status: "paid" } },
      { $group: { _id: "$course", sales: { $sum: 1 }, earnings: { $sum: "$instructorShare" } } },
    ]);
    const by = Object.fromEntries(stats.map((s) => [String(s._id), s]));
    res.json({
      feePercent: FEE,
      totalEarnings: stats.reduce((n, s) => n + s.earnings, 0) / 100, // naira
      courses: courses.map((c) => ({
        ...card(c), description: c.description,
        lessons: c.lessons.map((l) => ({ id: String(l._id), title: l.title, name: l.file && l.file.name })),
        sales: (by[String(c._id)] || {}).sales || 0, earnings: ((by[String(c._id)] || {}).earnings || 0) / 100,
      })),
    });
  }));

  app.post("/api/instructor/courses", instrAuth, approved, h(async (req, res) => {
    const b = req.body || {};
    const title = String(b.title || "").trim(), description = String(b.description || "").trim(), price = Number(b.price);
    if (title.length < 4) return bad(res, "Give the course a title (at least 4 characters).");
    if (description.length < 30) return bad(res, "Describe the course (at least 30 characters).");
    if (!CATEGORIES.includes(b.category) || !LEVELS.includes(b.level)) return bad(res, "Choose a category and level.");
    if (!Number.isInteger(price) || price < MIN_PRICE || price > 1000000) return bad(res, `Price must be a whole number from ₦${MIN_PRICE} to ₦1,000,000.`);
    const c = await Course.create({
      instructor: req.iid, title: title.slice(0, 120), description: description.slice(0, 4000), category: b.category, level: b.level, price,
      thumbnail: fileOf(b.thumbnail, prefix(req.iid, "thumbs")),
    });
    res.status(201).json(card(c));
  }));

  app.post("/api/instructor/courses/:id/lessons", instrAuth, approved, h(async (req, res) => {
    const c = await ownCourse(req, res); if (!c) return;
    const title = String((req.body && req.body.title) || "").trim();
    const file = fileOf(req.body && req.body.file, prefix(req.iid, "lessons"));
    if (title.length < 2) return bad(res, "Give the lesson a title.");
    if (!file) return bad(res, "Upload the lesson file first.");
    c.lessons.push({ title: title.slice(0, 120), file });
    await c.save();
    res.status(201).json({ ok: true });
  }));

  app.delete("/api/instructor/courses/:id/lessons/:lid", instrAuth, approved, h(async (req, res) => {
    const c = await ownCourse(req, res); if (!c) return;
    const l = c.lessons.id(req.params.lid);
    if (!l) return bad(res, "Lesson not found.", 404);
    destroy(l.file);
    l.deleteOne();
    if (!c.lessons.length) c.published = false;
    await c.save();
    res.json({ ok: true });
  }));

  app.post("/api/instructor/courses/:id/publish", instrAuth, approved, h(async (req, res) => {
    const c = await ownCourse(req, res); if (!c) return;
    const on = !!(req.body && req.body.published);
    if (on && !c.lessons.length) return bad(res, "Add at least one lesson before publishing.");
    c.published = on;
    await c.save();
    res.json({ published: c.published });
  }));

  /* ================= public catalogue ================= */
  app.get("/api/courses", h(async (req, res) => {
    const q = { published: true };
    if (CATEGORIES.includes(req.query.category)) q.category = req.query.category;
    const courses = await Course.find(q).populate("instructor", "name").sort({ createdAt: -1 });
    res.json(courses.map(card));
  }));

  app.get("/api/courses/:id", optStudent, h(async (req, res) => {
    const c = validId(req.params.id) && await Course.findOne({ _id: req.params.id, published: true })
      .populate("instructor", "name bio qualification yearsExperience");
    if (!c) return bad(res, "Course not found.", 404);
    const owned = req.user ? await Purchase.exists({ student: req.user.id, course: c._id, status: "paid" }) : false;
    const i = c.instructor;
    res.json({
      ...card(c), description: c.description, owned: !!owned,
      lessons: c.lessons.map((l) => ({ title: l.title })), // titles only; files stay locked until purchase
      instructorInfo: { name: i.name, bio: i.bio, qualification: i.qualification, yearsExperience: i.yearsExperience },
    });
  }));

  /* ================= Paystack ================= */
  app.post("/api/courses/:id/checkout", auth, limit(20), h(async (req, res) => {
    const c = validId(req.params.id) && await Course.findOne({ _id: req.params.id, published: true });
    if (!c) return bad(res, "Course not found.", 404);
    const s = await Student.findOne({ studentId: req.user.id });
    if (!s) return bad(res, "Please log in again.", 401);
    if (await Purchase.exists({ student: s.studentId, course: c._id, status: "paid" })) return bad(res, "You already own this course.");

    const amount = c.price * 100; // kobo
    const reference = `NXD-${Date.now()}-${crypto.randomBytes(4).toString("hex")}`;
    await Purchase.create({ student: s.studentId, course: c._id, instructor: c.instructor, amount, instructorShare: Math.round((amount * (100 - FEE)) / 100), reference });
    try {
      const d = await paystack("/transaction/initialize", "POST", {
        email: s.email, amount, currency: "NGN", reference,
        callback_url: `${CLIENT_URL}/training/payment/callback`,
        metadata: { courseId: String(c._id), studentId: s.studentId },
      });
      res.json({ url: d.authorization_url, reference });
    } catch (e) {
      console.error("Paystack initialize failed:", e.message);
      bad(res, "Could not start the payment. Please try again.", 502);
    }
  }));

  app.post("/api/payments/verify", auth, limit(30), h(async (req, res) => {
    const p = await settle(String((req.body && req.body.reference) || ""));
    if (!p || p.student !== req.user.id) return bad(res, "Payment not found.", 404);
    res.json({ status: p.status, courseId: String(p.course) });
  }));

  // Paystack calls this itself, so a student who closes the tab after paying still gets access
  app.post("/api/paystack/webhook", h(async (req, res) => {
    const want = Buffer.from(crypto.createHmac("sha512", PAYSTACK_KEY).update(req.rawBody || "").digest("hex"));
    const got = Buffer.from(String(req.headers["x-paystack-signature"] || ""));
    if (!PAYSTACK_KEY || want.length !== got.length || !crypto.timingSafeEqual(want, got)) return res.sendStatus(401);
    if (req.body.event === "charge.success" && req.body.data) await settle(String(req.body.data.reference));
    res.sendStatus(200);
  }));

  /* ================= student: purchased courses ================= */
  const owns = (req) => Purchase.exists({ student: req.user.id, course: req.params.id, status: "paid" });

  app.get("/api/my/courses", auth, h(async (req, res) => {
    const ps = await Purchase.find({ student: req.user.id, status: "paid" })
      .populate({ path: "course", populate: { path: "instructor", select: "name" } });
    res.json(ps.filter((p) => p.course).map((p) => card(p.course)));
  }));

  app.get("/api/courses/:id/learn", auth, h(async (req, res) => {
    if (!validId(req.params.id) || !(await owns(req))) return bad(res, "You have not purchased this course.", 403);
    const c = await Course.findById(req.params.id).populate("instructor", "name");
    if (!c) return bad(res, "Course not found.", 404);
    res.json({
      ...card(c), description: c.description,
      lessons: c.lessons.map((l) => ({ id: String(l._id), title: l.title, name: l.file.name, kind: l.file.resourceType === "video" ? "video" : "file", url: viewUrl(l.file) })),
    });
  }));

  /* ================= admin: review instructors ================= */
  app.get("/api/admin/instructors", adminAuth, h(async (req, res) => {
    const q = ["incomplete", "pending", "approved", "rejected"].includes(req.query.status) ? { status: req.query.status } : {};
    res.json(await Instructor.find(q).sort({ createdAt: -1 }).select("name email country qualification yearsExperience status createdAt"));
  }));

  app.get("/api/admin/instructors/:id", adminAuth, h(async (req, res) => {
    const i = validId(req.params.id) && await Instructor.findById(req.params.id);
    if (!i) return bad(res, "Instructor not found.", 404);
    res.json({
      ...pub(i),
      cvUrl: i.cv && i.cv.publicId ? downloadUrl(i.cv) : null,
      certificateUrls: i.certificates.map((f) => ({ name: f.name, url: downloadUrl(f) })),
    });
  }));

  app.post("/api/admin/instructors/:id/review", adminAuth, h(async (req, res) => {
    const { decision, note } = req.body || {};
    if (!["approved", "rejected"].includes(decision)) return bad(res, "Choose approve or reject.");
    if (decision === "rejected" && !String(note || "").trim()) return bad(res, "Add a short reason so the applicant knows what to fix.");
    const i = validId(req.params.id) && await Instructor.findById(req.params.id);
    if (!i) return bad(res, "Instructor not found.", 404);
    i.status = decision; i.reviewNote = String(note || "").trim().slice(0, 1000); i.reviewedAt = new Date();
    await i.save();
    const body = decision === "approved"
      ? `Hello ${i.name},\n\nYour instructor application has been approved. Log in to create and publish your courses:\n${CLIENT_URL}/training/instructor/login`
      : `Hello ${i.name},\n\nThank you for applying. We could not approve your application yet.\n\nReason: ${i.reviewNote}\n\nYou can update your documents and re-submit:\n${CLIENT_URL}/training/instructor/login`;
    try { await sendMail(i.email, `Your instructor application: ${decision}`, body); } catch (e) { console.error("Mail failed:", e.message); }
    res.json({ status: i.status });
  }));
};