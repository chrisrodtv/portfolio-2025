import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const PORT = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use('/assets', express.static(path.join(__dirname, '../assets')));
app.use('/pages', express.static(path.join(__dirname, '../pages')));
app.use(express.static(path.join(__dirname, '..')));
app.use(express.json({ limit: '50mb' }));

app.post('/save', (req, res) => {
  const { path: filePath, html } = req.body;
  if (!filePath || !html) return res.status(400).send('Missing data');

  const fullPath = path.join(__dirname, '..', filePath);
  fs.writeFile(fullPath, html, 'utf8', err => {
    if (err) return res.status(500).send('Failed to save');
    res.send('File saved successfully');
  });
});

app.listen(PORT, () => {
  console.log(`Studio running: http://localhost:${PORT}`);
});
