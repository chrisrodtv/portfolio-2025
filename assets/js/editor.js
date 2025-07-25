document.addEventListener("DOMContentLoaded", () => {
  const markdownInput = document.getElementById("markdown");
  const previewPane = document.getElementById("preview");
  const uploadBtn = document.getElementById("upload-btn");
  const browseBtn = document.getElementById("browse-btn");
  const fileInput = document.getElementById("media-upload");
  const refreshBtn = document.getElementById("refresh");

  // Live markdown preview
  markdownInput.addEventListener("input", async () => {
    const res = await fetch("/preview", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ markdown: markdownInput.value })
    });
    previewPane.innerHTML = await res.text();
  });

  // Upload media and inject links
  uploadBtn.addEventListener("click", async () => {
    const files = fileInput.files;
    if (!files.length) return;

    const form = new FormData();
    for (let f of files) form.append("media", f);

    const res = await fetch("/upload", { method: "POST", body: form });
    const data = await res.json();

    for (let url of data.urls) {
      markdownInput.value += `\n![media](${url})\n`;
      markdownInput.dispatchEvent(new Event("input"));
    }
  });

  // Browse simulated Backblaze folder structure
  browseBtn.addEventListener("click", async () => {
    const res = await fetch("/browse-backblaze");
    const files = await res.json();

    const selected = prompt(
      "Select file number:\n" +
      files.map((f, i) => `${i + 1}: ${f.name}`).join("\n")
    );

    const file = files[selected - 1];
    if (file) {
      markdownInput.value += `\n![media](${file.url})\n`;
      markdownInput.dispatchEvent(new Event("input"));
    }
  });

  // Project list refresh
  refreshBtn.addEventListener("click", async () => {
    const res = await fetch("/projects");
    const folders = await res.json();
    const list = document.getElementById("project-list");

    list.innerHTML = folders.map(f => `<div class="project-folder">${f}</div>`).join("");
  });

  refreshBtn.click(); // Auto-load on start
});
