const toolbar = document.createElement('div');
toolbar.id = 'studio-toolbar';
toolbar.innerHTML = `
  <button onclick="window.saveEdits()">💾 Save</button>
  <button onclick="window.toggleEdit()">✏️ Edit</button>
  <button onclick="window.insertBlock()">➕ Block</button>
  <button onclick="window.insertVideo()">📹 Video</button>
  <input type="file" id="filePicker" style="display: none;" />
`;
document.body.appendChild(toolbar);
toolbar.setAttribute('contenteditable', 'false');

// Edit Mode
window.toggleEdit = () => {
  const active = !document.body.isContentEditable;
  document.body.contentEditable = active;
  document.designMode = active ? 'on' : 'off';
};

// Save
window.saveEdits = async () => {
  const html = document.documentElement.outerHTML;
  const path = window.location.pathname.slice(1);
  const res = await fetch('/save', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ path, html })
  });
  alert(await res.text());
};

// Insert block
window.insertBlock = () => {
  const block = document.createElement('div');
  block.textContent = 'Editable Block';
  block.style.border = '1px dashed gray';
  block.style.padding = '1rem';
  block.setAttribute('contenteditable', 'true');
  document.body.appendChild(block);
};

// Insert video (mock)
window.insertVideo = () => {
  const vid = document.createElement('video');
  vid.controls = true;
  vid.src = 'video.mp4';
  vid.width = 400;
  document.body.appendChild(vid);
};
