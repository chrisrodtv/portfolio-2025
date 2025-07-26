const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

// Middleware to parse JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));
app.use('/pages', express.static(path.join(__dirname, 'pages')));
app.use('/studio', express.static(path.join(__dirname, 'studio')));

// 🔧 Route: Get list of projects (from /pages/work/)
app.get('/projects', async (req, res) => {
  const baseDir = path.join(__dirname, 'pages', 'work');

  try {
    const folders = await fs.promises.readdir(baseDir, { withFileTypes: true });

    const projects = [];

    for (const folder of folders) {
      if (folder.isDirectory()) {
        const htmlPath = path.join(baseDir, folder.name, `${folder.name}-index.html`);
        try {
          await fs.promises.access(htmlPath);
          projects.push({
            name: folder.name,
            path: `/pages/work/${folder.name}/${folder.name}-index.html`,
          });
        } catch {
          // skip folders with no matching HTML file
        }
      }
    }

    res.json(projects);
  } catch (err) {
    console.error('Error reading projects:', err);
    res.status(500).send('Could not load projects');
  }
});

// 🔧 Route: Load a project file
app.get('/load', async (req, res) => {
  const filePath = path.join(__dirname, req.query.path || '');
  try {
    const content = await fs.promises.readFile(filePath, 'utf-8');
    res.send(content);
  } catch (err) {
    console.error('Failed to load file:', err);
    res.status(500).send('Failed to load file');
  }
});

// 🔧 Route: Save a project file
app.post('/save', async (req, res) => {
  const filePath = path.join(__dirname, req.body.path || '');
  const content = req.body.content || '';
  try {
    await fs.promises.writeFile(filePath, content, 'utf-8');
    res.send('Saved');
  } catch (err) {
    console.error('Failed to save file:', err);
    res.status(500).send('Failed to save file');
  }
});

// Default fallback
app.get('*', (req, res) => {
  res.status(404).send('Page not found');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
