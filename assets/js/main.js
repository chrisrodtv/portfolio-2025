document.addEventListener("DOMContentLoaded", () => {
  const themeToggle = document.getElementById("theme-toggle");
  themeToggle.addEventListener("click", () => {
    const body = document.body;
    body.classList.toggle("light-theme");
    themeToggle.textContent = body.classList.contains("light-theme") ? "☾" : "☀";
  });

  const landing = document.getElementById("landing");
  window.addEventListener("scroll", () => {
    if (window.scrollY > 100) {
      landing.style.opacity = "0";
      landing.style.pointerEvents = "none";
    } else {
      landing.style.opacity = "1";
      landing.style.pointerEvents = "all";
    }
  });
});
