function updatePreview() {
  const content = document.getElementById('markdown-content').value;
  fetch('/preview', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ markdown: content })
  })
  .then(res => res.text())
  .then(html => {
    document.getElementById('preview').innerHTML = html;
  });
}

document.getElementById('markdown-content')?.addEventListener('input', updatePreview);

function insertAtCursor(text) {
  const textarea = document.getElementById('markdown-content');
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const current = textarea.value;
  textarea.value = current.substring(0, start) + text + current.substring(end);
  textarea.focus();
  textarea.selectionStart = textarea.selectionEnd = start + text.length;
  updatePreview();
}

const uploadForm = document.getElementById('upload-form');
if (uploadForm) {
  uploadForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const fileInput = document.getElementById('image-upload');
    const formData = new FormData();
    formData.append('image', fileInput.files[0]);

    const res = await fetch('/upload-image', {
      method: 'POST',
      body: formData
    });

    const data = await res.json();
    const markdown = `![alt text](${data.url})`;
    insertAtCursor(markdown);
    document.getElementById('upload-status').innerText = 'Uploaded ✓';
  });
}
