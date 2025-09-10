import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
app.use(cors());
app.use(express.json({ limit: "15mb" }));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

let photos = [];

// GET all
app.get("/photos", (req, res) => res.json(photos));

// GET one
app.get("/photos/:id", (req, res) => {
  const photo = photos.find(p => p.id === parseInt(req.params.id));
  if (!photo) return res.status(404).json({ error: "Not found" });
  res.json(photo);
});

// POST (add)
app.post("/photos", (req, res) => {
  const { title, url } = req.body;
  if (!url) return res.status(400).json({ error: "Missing image" });
  const newPhoto = { id: photos.length + 1, title: title || "Untitled", url };
  photos.push(newPhoto);
  res.status(201).json(newPhoto);
});

// PUT (edit)
app.put("/photos/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const photo = photos.find(p => p.id === id);
  if (!photo) return res.status(404).json({ error: "Not found" });

  const { title, url } = req.body;
  if (title) photo.title = title;
  if (url) photo.url = url;

  res.json(photo);
});

// DELETE
app.delete("/photos/:id", (req, res) => {
  photos = photos.filter(p => p.id !== parseInt(req.params.id));
  res.json({ message: "Deleted" });
});

// Pages
app.get("/", (req, res) => res.render("upload"));
app.get("/view", (req, res) => res.render("view", { photos }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
