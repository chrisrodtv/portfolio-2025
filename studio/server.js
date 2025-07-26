const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname, 'pages/studio/public')));
app.use(express.json());

// 🔍 Phase 2: Load list of project files
app.get('/projects', (req, res) => {
  const projectsDir = path.join(__dirname, 'pages', 'work');
  const projects = [];

  fs.readdirSync(projectsDir).forEach(folder => {
    const filePath = path.join(projectsDir, folder, `${folder}-index.html`);
    if (fs.existsSync(filePath)) {
      projects.push({
        name: `${folder}-index.html`,
        path: `pages/work/${folder}/${folder}-index.html`
      });
    }
  });

  res.json(projects);
});

// 📥 Load a specific file
app.get('/load', (req, res) => {
  const target = req.query.path;
  if (!target) return res.status(400).send('Missing path');

  const fullPath = path.join(__dirname, target);
  if (!fs.existsSync(fullPath)) return res.status(404).send('File not found');

  const contents = fs.readFileSync(fullPath, 'utf-8');
  res.send(contents);
});

// 💾 Save updated content
app.post('/save', (req, res) => {
  const { path: filePath, content } = req.body;
  if (!filePath || !content) return res.status(400).send('Missing data');

  const fullPath = path.join(__dirname, filePath);
  fs.writeFileSync(fullPath, content, 'utf-8');
  res.sendStatus(200);
});

app.listen(PORT, () => {
  console.log(`Studio server running at http://localhost:${PORT}`);
});
