import express from "express";
import cors from "cors";
import { readFile, writeFile } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import multer from "multer";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;
const DATA_PATH = path.join(__dirname, "data", "db.json");
const UPLOADS_DIR = path.join(__dirname, "uploads");

app.use(cors());
app.use(express.json({ limit: "1mb" }));
app.use("/uploads", express.static(UPLOADS_DIR));

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOADS_DIR),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname || "");
    const safeExt = ext && ext.length <= 6 ? ext : "";
    cb(null, `profile-${Date.now()}${safeExt}`);
  }
});
const upload = multer({ storage });

async function readDb() {
  try {
    const raw = await readFile(DATA_PATH, "utf-8");
    return JSON.parse(raw);
  } catch (err) {
    if (err.code === "ENOENT") {
      const initial = {
        profile: {
          name: "Your Name",
          role: "Full-Stack Developer",
          summary: "Short bio about you.",
          location: "City, Country",
          email: "you@email.com",
          photo: ""
        },
        projects: [
          {
            title: "Project One",
            description: "What it does and why it matters.",
            tech: ["Vue", "Node.js"],
            link: "https://example.com"
          }
        ],
        skills: ["JavaScript", "Vue", "Node.js"],
        experience: [
          {
            company: "Company Name",
            role: "Job Title",
            period: "2024 - Present",
            details: "Key achievements and responsibilities."
          }
        ],
        contact: {
          phone: "+62 812-0000-0000",
          email: "you@email.com",
          linkedin: "https://linkedin.com/in/yourname",
          github: "https://github.com/yourname"
        }
      };
      await writeDb(initial);
      return initial;
    }
    throw err;
  }
}

async function writeDb(data) {
  const json = JSON.stringify(data, null, 2);
  await writeFile(DATA_PATH, json, "utf-8");
}

app.get("/api/portfolio", async (req, res) => {
  const data = await readDb();
  res.json(data);
});

app.put("/api/portfolio", async (req, res) => {
  const data = req.body;
  await writeDb(data);
  res.json(data);
});

app.get("/api/profile", async (req, res) => {
  const data = await readDb();
  res.json(data.profile);
});

app.put("/api/profile", async (req, res) => {
  const data = await readDb();
  data.profile = req.body;
  await writeDb(data);
  res.json(data.profile);
});

app.post("/api/profile/photo", upload.single("photo"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }
  const data = await readDb();
  data.profile = data.profile || {};
  data.profile.photo = `/uploads/${req.file.filename}`;
  await writeDb(data);
  res.json({ photo: data.profile.photo });
});

app.get("/api/projects", async (req, res) => {
  const data = await readDb();
  res.json(data.projects);
});

app.put("/api/projects", async (req, res) => {
  const data = await readDb();
  data.projects = req.body;
  await writeDb(data);
  res.json(data.projects);
});

app.get("/api/skills", async (req, res) => {
  const data = await readDb();
  res.json(data.skills);
});

app.put("/api/skills", async (req, res) => {
  const data = await readDb();
  data.skills = req.body;
  await writeDb(data);
  res.json(data.skills);
});

app.get("/api/experience", async (req, res) => {
  const data = await readDb();
  res.json(data.experience);
});

app.put("/api/experience", async (req, res) => {
  const data = await readDb();
  data.experience = req.body;
  await writeDb(data);
  res.json(data.experience);
});

app.get("/api/contact", async (req, res) => {
  const data = await readDb();
  res.json(data.contact);
});

app.put("/api/contact", async (req, res) => {
  const data = await readDb();
  data.contact = req.body;
  await writeDb(data);
  res.json(data.contact);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
