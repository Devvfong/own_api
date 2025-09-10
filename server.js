import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
app.use(cors());
app.use(express.json({ limit: "15mb" })); // for large images

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// EJS setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// In-memory storage
let photos = [];

// API
app.get("/photos", (req, res) => res.json(photos));

app.post("/photos", (req, res) => {
  const { title, url } = req.body;
  if (!title || !url) return res.status(400).json({ error: "Missing fields" });
  const newPhoto = { id: photos.length + 1, title, url };
  photos.push(newPhoto);
  res.status(201).json(newPhoto);
});

app.delete("/photos/:id", (req, res) => {
  photos = photos.filter(p => p.id !== parseInt(req.params.id));
  res.json({ message: "Deleted" });
});

// Dynamic pages
app.get("/", (req, res) => res.render("upload"));
app.get("/view", (req, res) => res.render("view", { photos }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
