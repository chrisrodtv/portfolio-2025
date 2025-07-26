const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

// Serve editor UI
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "studio-index.html"));
});

// List all project HTML files
app.get("/folders", (req, res) => {
  const base = path.join(__dirname, "..", "pages", "work");

  const getProjectFiles = dir => {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);
      if (stat && stat.isDirectory()) {
        results = results.concat(getProjectFiles(fullPath));
      } else if (file.endsWith("-index.html")) {
        results.push({
          name: file,
          path: path.relative(path.join(__dirname, ".."), fullPath)
        });
      }
    });
    return results;
  };

  try {
    const files = getProjectFiles(base);
    res.json(files);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error reading folders");
  }
});

// Load file content
app.get("/file", (req, res) => {
  const relPath = req.query.path;
  const fullPath = path.join(__dirname, "..", relPath);
  if (!fs.existsSync(fullPath)) {
    return res.status(404).send("File not found");
  }
  const content = fs.readFileSync(fullPath, "utf-8");
  res.send(content);
});

// Save file content
app.post("/save", (req, res) => {
  const relPath = req.body.path;
  const fullPath = path.join(__dirname, "..", relPath);
  try {
    fs.writeFileSync(fullPath, req.body.content, "utf-8");
    res.send("File saved");
  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to save file");
  }
});

app.listen(PORT, () => {
  console.log(`Studio server running at http://localhost:${PORT}`);
});
