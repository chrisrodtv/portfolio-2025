document.addEventListener("DOMContentLoaded", () => {
  const buttons = document.querySelectorAll(".theme-button");
  const body = document.body;

  const saved = localStorage.getItem("theme") || "dark";
  body.classList.add(`theme-${saved}`);

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const mode = btn.getAttribute("data-theme");
      body.classList.remove("theme-dark", "theme-light", "theme-accent");
      body.classList.add(`theme-${mode}`);
      localStorage.setItem("theme", mode);
    });
  });
});
