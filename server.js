import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
app.use(cors());
app.use(express.json());

// Resolve __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Set EJS as view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// In-memory database
let photos = [];

// --- API Endpoints ---
app.get("/photos", (req, res) => res.json(photos));

app.post("/photos", (req, res) => {
  const newPhoto = {
    id: photos.length + 1,
    title: req.body.title,
    url: req.body.url,
  };
  photos.push(newPhoto);
  res.json(newPhoto);
});

app.put("/photos/:id", (req, res) => {
  const photo = photos.find((p) => p.id === parseInt(req.params.id));
  if (!photo) return res.status(404).json({ error: "Not found" });
  photo.title = req.body.title ?? photo.title;
  photo.url = req.body.url ?? photo.url;
  res.json(photo);
});

app.delete("/photos/:id", (req, res) => {
  photos = photos.filter((p) => p.id !== parseInt(req.params.id));
  res.json({ message: "Deleted" });
});

// --- Dynamic Pages ---
app.get("/", (req, res) => res.render("upload")); // upload page
app.get("/view", (req, res) => res.render("view", { photos })); // view page

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
