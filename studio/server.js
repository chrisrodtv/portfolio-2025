import express from 'express';
import fs from 'fs';
import path from 'path';
import multer from 'multer';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const app = express();
const upload = multer({ dest: 'uploads/' });

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = path.join(__dirname, '..'); // go up one level to /portfolio-2025

// Serve global assets and pages
app.use('/assets', express.static(path.join(projectRoot, 'assets'), {
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.js')) {
      res.setHeader('Content-Type', 'application/javascript');
    }
  }
}));

app.use('/pages', express.static(path.join(projectRoot, 'pages')));
app.use(express.static(__dirname)); // for studio-index.html
app.use(express.json());

// Serve the studio editor
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'studio-index.html'));
});

// List all project files under /pages/work/
app.get('/list-projects', (req, res) => {
  const workDir = path.join(projectRoot, 'pages/work');
  const projects = fs.readdirSync(workDir)
    .filter(f => f.endsWith('-index.html'))
    .map(f => `work/${f}`);
  res.json(['info.html', 'reel.html', 'funzies.html', ...projects]);
});

// Save edited HTML
app.post('/save-html', (req, res) => {
  const { path: filePath, html } = req.body;
  const fullPath = path.join(projectRoot, 'pages', filePath);
  fs.writeFileSync(fullPath, html, 'utf-8');
  res.sendStatus(200);
});

// Duplicate a page
app.post('/duplicate-page', (req, res) => {
  const { from, to } = req.body;
  const src = path.join(projectRoot, 'pages', from);
  const dest = path.join(projectRoot, 'pages', to);
  fs.copyFileSync(src, dest);
  res.sendStatus(200);
});

// Upload media to global media folder
app.post('/upload', upload.single('file'), (req, res) => {
  const filename = req.file.originalname;
  const tempPath = req.file.path;
  const targetPath = path.join(projectRoot, 'assets/media/', filename);
  fs.renameSync(tempPath, targetPath);
  res.sendStatus(200);
});

app.listen(3000, () => {
  console.log('Studio Editor running at http://localhost:3000');
});
