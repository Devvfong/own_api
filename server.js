const express = require("express");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 10000;
// server.js
const cors = require("cors");
app.use(cors()); // allow all origins

app.use(express.json());

// Serve static files
app.use(express.static(path.join(__dirname, "public")));

// In-memory storage
let photos = [];
let nextId = 1;

// GET all photos
app.get("/photos", (req, res) => {
  res.json(photos);
});

// POST new photo
app.post("/photos", (req, res) => {
  const { title, url } = req.body;
  if (!title || !url) return res.status(400).json({ error: "Title & URL required" });
  const newPhoto = { id: nextId++, title, url };
  photos.push(newPhoto);
  res.status(201).json(newPhoto);
});

// PUT update photo
app.put("/photos/:id", (req, res) => {
  const photo = photos.find(p => p.id === parseInt(req.params.id));
  if (!photo) return res.status(404).json({ error: "Photo not found" });
  const { title, url } = req.body;
  if (title) photo.title = title;
  if (url) photo.url = url;
  res.json(photo);
});

// DELETE photo
app.delete("/photos/:id", (req, res) => {
  const index = photos.findIndex(p => p.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ error: "Photo not found" });
  const deleted = photos.splice(index, 1);
  res.json(deleted[0]);
});

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
