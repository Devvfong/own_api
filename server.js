const express = require("express");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 10000;

// Serve static files from public folder
app.use(express.static(path.join(__dirname, "public")));

app.use(express.json());

// In-memory photo storage
let photos = [];
let nextId = 1;

// API routes
app.get("/photos", (req, res) => res.json(photos));

app.post("/photos", (req, res) => {
  const { title, url } = req.body;
  if (!title || !url) return res.status(400).json({ error: "Title & URL required" });
  const newPhoto = { id: nextId++, title, url };
  photos.push(newPhoto);
  res.status(201).json(newPhoto);
});

app.put("/photos/:id", (req, res) => {
  const photo = photos.find(p => p.id === parseInt(req.params.id));
  if (!photo) return res.status(404).json({ error: "Photo not found" });
  const { title, url } = req.body;
  if (title) photo.title = title;
  if (url) photo.url = url;
  res.json(photo);
});

app.delete("/photos/:id", (req, res) => {
  const index = photos.findIndex(p => p.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ error: "Photo not found" });
  const deleted = photos.splice(index, 1);
  res.json(deleted[0]);
});

// Fallback route to serve index.html for base URL
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
