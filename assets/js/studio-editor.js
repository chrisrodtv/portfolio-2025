let currentPath = '';
let historyStack = [];
let redoStack = [];

function $(id) {
  return document.getElementById(id);
}

window.onload = async () => {
  await loadProjects();
  $('projectSelector').addEventListener('change', loadPage);
  $('paddingSlider').addEventListener('input', () => applyStyle('padding', $('paddingSlider').value + 'px'));
  $('fontSelector').addEventListener('change', () => applyStyle('fontFamily', $('fontSelector').value));
  $('colorPicker').addEventListener('input', () => applyStyle('color', $('colorPicker').value));
  ['fgColor', 'bgColor', 'accentColor'].forEach(id => {
    $(id).addEventListener('input', updateCSSVariable);
  });
};

async function loadProjects() {
  const res = await fetch('/list-projects');
  const projects = await res.json();
  $('projectSelector').innerHTML = projects.map(p => `<option value="${p}">${p}</option>`).join('');
  loadPage();
}

async function loadPage() {
  const project = $('projectSelector').value;
  currentPath = `/pages/${project}`;
  const iframe = $('preview');
  iframe.src = currentPath;

  iframe.onload = () => {
    const doc = iframe.contentDocument;
    const html = doc.documentElement.outerHTML;
    saveToHistory(html);
    parseMetadata(doc);
    enableEditing(doc.body);
  };
}

function parseMetadata(doc) {
  const comments = Array.from(doc.childNodes).filter(n => n.nodeType === 8);
  $('pageTitle').value = comments.find(c => c.nodeValue.startsWith(' title:'))?.nodeValue.split(':')[1].trim() || '';
  $('pageDescription').value = comments.find(c => c.nodeValue.startsWith(' description:'))?.nodeValue.split(':')[1].trim() || '';
}

function enableEditing(root) {
  root.querySelectorAll('*').forEach(el => {
    if (el.tagName === 'IMG') {
      el.onclick = () => replaceImage(el);
    } else {
      el.contentEditable = true;
      el.oninput = () => saveToHistory();
    }
  });
}

function insertSection() {
  const doc = $('preview').contentDocument;
  const div = doc.createElement('div');
  div.innerHTML = `<h2 contenteditable="true">New Section</h2><p contenteditable="true">Lorem ipsum</p>`;
  doc.body.appendChild(div);
  saveToHistory();
}

function insertImageGrid() {
  const doc = $('preview').contentDocument;
  const div = doc.createElement('div');
  div.innerHTML = `<div><img src="https://placehold.co/300x200" /><img src="https://placehold.co/300x200" /></div>`;
  doc.body.appendChild(div);
  enableEditing(doc.body);
  saveToHistory();
}

function insertButton() {
  const doc = $('preview').contentDocument;
  const btn = doc.createElement('button');
  btn.textContent = 'Click Me';
  doc.body.appendChild(btn);
  saveToHistory();
}

function replaceImage(el) {
  const url = prompt("Paste image URL:");
  if (url) {
    el.src = url;
    saveToHistory();
  }
}

function format(cmd) {
  $('preview').contentWindow.document.execCommand(cmd);
  saveToHistory();
}

function applyStyle(prop, value) {
  const sel = $('preview').contentWindow.getSelection();
  if (!sel.rangeCount) return;
  const el = sel.getRangeAt(0).startContainer.parentElement;
  el.style[prop] = value;
  saveToHistory();
}

function updateCSSVariable(e) {
  const root = $('preview').contentDocument.documentElement;
  root.style.setProperty(`--${e.target.id}`, e.target.value);
  saveToHistory();
}

function saveToHistory(htmlOverride = null) {
  const doc = $('preview').contentDocument.documentElement.outerHTML;
  historyStack.push(htmlOverride || doc);
  redoStack = [];
}

function undo() {
  if (historyStack.length > 1) {
    redoStack.push(historyStack.pop());
    const prev = historyStack[historyStack.length - 1];
    $('preview').contentDocument.open();
    $('preview').contentDocument.write(prev);
    $('preview').contentDocument.close();
    enableEditing($('preview').contentDocument.body);
  }
}

function redo() {
  if (redoStack.length > 0) {
    const next = redoStack.pop();
    $('preview').contentDocument.open();
    $('preview').contentDocument.write(next);
    $('preview').contentDocument.close();
    enableEditing($('preview').contentDocument.body);
    saveToHistory(next);
  }
}

async function savePage() {
  const html = $('preview').contentDocument.documentElement.outerHTML;
  const path = $('projectSelector').value;
  await fetch('/save-html', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({ path, html })
  });
  alert('Saved!');
}

function duplicatePage() {
  const title = prompt('New file name (e.g. "copy.html")');
  if (title) {
    fetch('/duplicate-page', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ from: $('projectSelector').value, to: title })
    }).then(() => {
      alert('Page duplicated!');
      loadProjects();
    });
  }
}

function handleUpload(files) {
  [...files].forEach(async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    await fetch('/upload', { method: 'POST', body: formData });
  });
}
window.insertSection = insertSection;
window.insertImageGrid = insertImageGrid;
window.insertButton = insertButton;
window.undo = undo;
window.redo = redo;
window.format = format;
window.savePage = savePage;
window.duplicatePage = duplicatePage;
window.handleUpload = handleUpload;
window.replaceImage = replaceImage;
