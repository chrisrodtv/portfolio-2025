document.addEventListener("DOMContentLoaded", () => {
  const projectSelect = document.getElementById("projectSelect");
  const editor = document.getElementById("editor");
  const saveBtn = document.getElementById("saveBtn");

  let currentPath = null;

  // Load list of projects
  fetch("/folders")
    .then(res => res.json())
    .then(data => {
      projectSelect.innerHTML = "";
      data.forEach(file => {
        const option = document.createElement("option");
        option.value = file.path;
        option.textContent = file.name;
        projectSelect.appendChild(option);
      });
      if (data.length > 0) {
        projectSelect.dispatchEvent(new Event("change"));
      }
    });

  // Load content when project is selected
  projectSelect.addEventListener("change", () => {
    currentPath = projectSelect.value;
    fetch(`/file?path=${encodeURIComponent(currentPath)}`)
      .then(res => res.text())
      .then(text => {
        editor.value = text;
      });
  });

  // Save button
  saveBtn.addEventListener("click", () => {
    if (!currentPath) return;
    fetch("/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path: currentPath, content: editor.value })
    })
      .then(res => res.text())
      .then(msg => alert("Saved!"))
      .catch(err => alert("Error saving file."));
  });
});
