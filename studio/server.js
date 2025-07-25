const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const marked = require("marked");
const app = express();
const PORT = 3000;

app.use(express.static("public"));
app.use(express.json());
app.set("view engine", "ejs");

const upload = multer({ dest: "temp_uploads/" });

// Serve main interface
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "studio-index.html"));
});

// Get list of project folders
app.get("/projects", (req, res) => {
  const dir = path.join(__dirname, "../pages/work/");
  const folders = fs.readdirSync(dir).filter(f => fs.statSync(path.join(dir, f)).isDirectory());
  res.json(folders);
});

// Handle markdown preview
app.post("/preview", (req, res) => {
  const html = marked.parse(req.body.markdown || "");
  res.send(html);
});

// Handle media upload
app.post("/upload", upload.array("media"), (req, res) => {
  const urls = req.files.map(file => {
    const url = `https://example-temp-bucket.com/${file.originalname}`;
    fs.unlinkSync(file.path); // Delete local copy
    return url;
  });
  res.json({ urls });
});

// Placeholder for browsing Backblaze (to be implemented)
app.get("/browse-backblaze", (req, res) => {
  res.json([
    { name: "project-thumb.jpg", url: "https://cdn.example.com/projects/thumb.jpg" },
    { name: "clip.mp4", url: "https://cdn.example.com/projects/clip.mp4" }
  ]);
});

app.listen(PORT, () => {
  console.log(`Studio running at http://localhost:${PORT}`);
});
