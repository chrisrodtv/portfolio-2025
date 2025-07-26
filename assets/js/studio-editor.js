let currentPath = 'index.html';
let historyStack = [];
let redoStack = [];
let selectedElement = null;

const $ = id => document.getElementById(id);

// === INIT ===
window.onload = () => {
  $('projectSelector').value = 'index.html';
  $('projectSelector').addEventListener('change', loadPage);
  setupInspector();
  $('uploadInput').addEventListener('change', handleUpload);
  loadPage();
};

// === LOAD REAL SITE AND INJECT EDITOR ===
function loadPage() {
  $('preview').src = '/index.html?studio=true';
  $('preview').onload = () => {
    const doc = $('preview').contentDocument;
    injectStudioCSS(doc);
    injectEditingTools(doc);
    enableEditing(doc.body);
    saveToHistory(doc.documentElement.outerHTML);
  };
}

// === INJECT STUDIO STYLES + OVERLAYS ===
function injectStudioCSS(doc) {
  const style = doc.createElement('link');
  style.rel = 'stylesheet';
  style.href = '/assets/css/studio.css';
  doc.head.appendChild(style);
}

function injectEditingTools(doc) {
  const overlay = doc.createElement('div');
  overlay.id = 'studio-floating-tools';
  overlay.style = 'position:fixed;top:10px;left:10px;z-index:9999;padding:8px;background:#fff;border:1px solid #000;';
  overlay.innerHTML = `<span style="font-weight:bold">Studio Editor Active</span>`;
  doc.body.appendChild(overlay);
}

// === BLOCK INSERTION ===
function insertBlock(type) {
  const doc = $('preview').contentDocument;
  let el = doc.createElement('div');
  el.contentEditable = true;

  switch (type) {
    case 'text':
      el.innerHTML = `<p contenteditable="true">Editable text block</p>`;
      break;
    case 'image':
      el.innerHTML = `<img src="https://placehold.co/600x400" />`;
      break;
    case 'video':
      el.innerHTML = `<video controls width="300"><source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4"></video>`;
      break;
    case 'button':
      el.innerHTML = `<button>Edit Me</button>`;
      break;
    case 'embed':
      el.innerHTML = `<iframe width="300" height="200" src="https://example.com"></iframe>`;
      break;
    case 'section':
      el.innerHTML = `<section><h2>New Section</h2><p>Text here...</p></section>`;
      break;
  }

  doc.body.appendChild(el);
  enableEditing(doc.body);
  saveToHistory();
}

// === STYLE INSPECTOR ===
function setupInspector() {
  $('fontSizeInput').addEventListener('input', () => {
    if (selectedElement) selectedElement.style.fontSize = $('fontSizeInput').value + 'px';
  });
  $('paddingInput').addEventListener('input', () => {
    if (selectedElement) selectedElement.style.padding = $('paddingInput').value + 'px';
  });
  $('colorInput').addEventListener('input', () => {
    if (selectedElement) selectedElement.style.color = $('colorInput').value;
  });
  $('bgInput').addEventListener('input', () => {
    if (selectedElement) selectedElement.style.backgroundColor = $('bgInput').value;
  });

  $('toggleLogo').addEventListener('change', toggleComponent);
  $('toggleNav').addEventListener('change', toggleComponent);
  $('toggleFooter').addEventListener('change', toggleComponent);
}

function toggleComponent() {
  const doc = $('preview').contentDocument;
  if (this.id === 'toggleLogo') {
    toggleBlock(doc, 'logo', '<div id="logo">LOGO BLOCK</div>');
  }
  if (this.id === 'toggleNav') {
    toggleBlock(doc, 'nav', '<nav id="nav">NAVIGATION</nav>');
  }
  if (this.id === 'toggleFooter') {
    toggleBlock(doc, 'footer', '<footer id="footer">FOOTER</footer>');
  }
}

function toggleBlock(doc, id, html) {
  const el = doc.getElementById(id);
  if (el) el.remove();
  else {
    const wrapper = doc.createElement('div');
    wrapper.innerHTML = html;
    doc.body.insertBefore(wrapper.firstChild, doc.body.firstChild);
  }
  saveToHistory();
}

// === ENABLE EDITING ===
function enableEditing(root) {
  root.querySelectorAll('*').forEach(el => {
    if (!['HTML', 'BODY', 'SCRIPT', 'STYLE'].includes(el.tagName)) {
      el.onclick = e => {
        e.stopPropagation();
        selectedElement = el;
        $('fontSizeInput').value = parseInt(getComputedStyle(el).fontSize) || 16;
        $('paddingInput').value = parseInt(getComputedStyle(el).padding) || 0;
        $('colorInput').value = rgbToHex(getComputedStyle(el).color);
        $('bgInput').value = rgbToHex(getComputedStyle(el).backgroundColor);
      };
      if (el.tagName !== 'IMG' && !el.closest('video')) el.contentEditable = true;
    }
  });
}

function rgbToHex(rgb) {
  const rgbMatch = rgb.match(/\d+/g);
  return rgbMatch ? "#" + rgbMatch.map(x => parseInt(x).toString(16).padStart(2, '0')).join('') : '#000000';
}

// === UPLOAD ===
function handleUpload(e) {
  const file = e.target.files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append('file', file);

  fetch('/upload', {
    method: 'POST',
    body: formData
  }).then(res => res.json()).then(data => {
    if (selectedElement && selectedElement.tagName === 'IMG') {
      selectedElement.src = data.url;
    } else {
      alert('Uploaded: ' + data.url);
    }
  });
}

// === UNDO / REDO ===
function saveToHistory(html) {
  const current = html || $('preview').contentDocument.documentElement.outerHTML;
  historyStack.push(current);
  redoStack = [];
}

function undo() {
  if (historyStack.length > 1) {
    redoStack.push(historyStack.pop());
    const prev = historyStack[historyStack.length - 1];
    $('preview').contentDocument.open();
    $('preview').contentDocument.write(prev);
    $('preview').contentDocument.close();
    injectStudioCSS($('preview').contentDocument);
    enableEditing($('preview').contentDocument.body);
  }
}

function redo() {
  if (redoStack.length) {
    const next = redoStack.pop();
    $('preview').contentDocument.open();
    $('preview').contentDocument.write(next);
    $('preview').contentDocument.close();
    injectStudioCSS($('preview').contentDocument);
    enableEditing($('preview').contentDocument.body);
    saveToHistory(next);
  }
}

// === SAVE & PREVIEW ===
function savePage() {
  const html = $('preview').contentDocument.documentElement.outerHTML;
  fetch('/save-html', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ path: currentPath, html })
  }).then(() => alert('Saved!'));
}

function previewPage() {
  window.open(`/${currentPath}`, '_blank');
}

// === AUTO EXPORT ===
Object.entries({
  loadPage,
  insertBlock,
  savePage,
  undo,
  redo,
  previewPage,
  handleUpload
}).forEach(([k, fn]) => window[k] = fn);
