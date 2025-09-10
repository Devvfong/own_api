import express from "express";
import cors from "cors";

const app = express();
app.use(cors()); // allow cross-origin requests
app.use(express.json()); // parse JSON bodies

// In-memory "database"
let photos = [
  { id: 1, title: "Sunset", url: "https://example.com/sunset.jpg" },
  { id: 2, title: "Beach", url: "https://example.com/beach.jpg" },
];

// --- CRUD Endpoints ---

// GET all
app.get("/photos", (req, res) => {
  res.json(photos);
});

// GET one
app.get("/photos/:id", (req, res) => {
  const photo = photos.find((p) => p.id === parseInt(req.params.id));
  if (!photo) return res.status(404).json({ error: "Not found" });
  res.json(photo);
});

// POST (create)
app.post("/photos", (req, res) => {
  const newPhoto = {
    id: photos.length ? photos[photos.length - 1].id + 1 : 1,
    title: req.body.title,
    url: req.body.url,
  };
  photos.push(newPhoto);
  res.status(201).json(newPhoto);
});

// PUT (update)
app.put("/photos/:id", (req, res) => {
  const photo = photos.find((p) => p.id === parseInt(req.params.id));
  if (!photo) return res.status(404).json({ error: "Not found" });

  photo.title = req.body.title ?? photo.title;
  photo.url = req.body.url ?? photo.url;
  res.json(photo);
});

// DELETE
app.delete("/photos/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const index = photos.findIndex((p) => p.id === id);
  if (index === -1) return res.status(404).json({ error: "Not found" });

  photos.splice(index, 1);
  res.json({ message: "Deleted" });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API running on port ${PORT}`));
