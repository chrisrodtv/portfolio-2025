document.addEventListener("DOMContentLoaded", () => {
  const landing = document.getElementById("landing");
  const main = document.getElementById("main");
  const themeToggle = document.getElementById("theme-toggle");
  const menuToggle = document.getElementById("menu-toggle");
  const nav = document.getElementById("main-nav");

  // Theme toggle
  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("light-theme");
    themeToggle.textContent = document.body.classList.contains("light-theme") ? "☾" : "☀";
  });

  // Landing transition
  window.addEventListener("scroll", () => {
    landing.classList.add("hidden");
    main.classList.remove("hidden");
  }, { once: true });

  // Menu toggle
  menuToggle.addEventListener("click", () => {
    nav.classList.toggle("active");
  });
});
