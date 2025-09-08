const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON
app.use(express.json());

// In-memory data storage
let items = [];
let nextId = 1;

// ✅ CREATE - add new item
app.post("/items", (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: "Name is required" });

  const newItem = { id: nextId++, name };
  items.push(newItem);
  res.status(201).json(newItem);
});

// ✅ READ - get all items
app.get("/items", (req, res) => {
  res.json(items);
});

// ✅ READ - get one item by id
app.get("/items/:id", (req, res) => {
  const item = items.find(i => i.id === parseInt(req.params.id));
  if (!item) return res.status(404).json({ error: "Item not found" });
  res.json(item);
});

// ✅ UPDATE - update item by id
app.put("/items/:id", (req, res) => {
  const item = items.find(i => i.id === parseInt(req.params.id));
  if (!item) return res.status(404).json({ error: "Item not found" });

  const { name } = req.body;
  if (!name) return res.status(400).json({ error: "Name is required" });

  item.name = name;
  res.json(item);
});

// ✅ DELETE - remove item by id
app.delete("/items/:id", (req, res) => {
  const index = items.findIndex(i => i.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ error: "Item not found" });

  const deleted = items.splice(index, 1);
  res.json(deleted[0]);
});

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
