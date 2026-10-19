import { iapi } from "./trainingApi";

// Keep these in line with PURPOSES in server/marketplace.js. Cloudinary's own plan limits also apply.
const RULES = {
  cv: { mb: 5, ext: ["pdf", "doc", "docx"] },
  certificate: { mb: 5, ext: ["pdf", "jpg", "jpeg", "png"] },
  thumbnail: { mb: 5, ext: ["jpg", "jpeg", "png", "webp"] },
  lesson: { mb: 100, ext: ["mp4", "mov", "webm", "m4v", "pdf"] },
};

export function checkFile(file, purpose) {
  const r = RULES[purpose];
  const ext = (file.name.split(".").pop() || "").toLowerCase();
  if (!r.ext.includes(ext)) throw new Error(`"${file.name}" must be one of: ${r.ext.join(", ")}.`);
  if (file.size > r.mb * 1024 * 1024) throw new Error(`"${file.name}" is too large (max ${r.mb} MB).`);
}

// Gets a signature from our server, then uploads straight to Cloudinary (nothing is stored on our server).
export async function uploadFile(file, purpose, onProgress = () => {}) {
  checkFile(file, purpose);
  const s = await iapi("/uploads/sign", "POST", { purpose });
  const fd = new FormData();
  fd.append("file", file);
  fd.append("api_key", s.apiKey);
  fd.append("signature", s.signature);
  Object.entries(s.params).forEach(([k, v]) => fd.append(k, v));

  const r = await new Promise((resolve, reject) => {
    const x = new XMLHttpRequest();
    x.open("POST", `https://api.cloudinary.com/v1_1/${s.cloudName}/auto/upload`);
    x.upload.onprogress = (e) => e.lengthComputable && onProgress(Math.round((e.loaded / e.total) * 100));
    x.onload = () => {
      let d = {};
      try { d = JSON.parse(x.responseText); } catch { /* keep empty */ }
      if (x.status >= 200 && x.status < 300) resolve(d);
      else reject(new Error((d.error && d.error.message) || "Upload failed."));
    };
    x.onerror = () => reject(new Error("Network error during upload."));
    x.send(fd);
  });
  return { publicId: r.public_id, resourceType: r.resource_type, format: r.format || "", bytes: r.bytes, name: file.name };
}