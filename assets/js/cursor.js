document.addEventListener("DOMContentLoaded", () => {
  const dot = document.querySelector(".cursor-dot");
  const outline = document.querySelector(".cursor-outline");

  let mouseX = 0, mouseY = 0;
  let outlineX = 0, outlineY = 0;

  document.addEventListener("mousemove", e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.left = `${mouseX}px`;
    dot.style.top = `${mouseY}px`;
  });

  function animate() {
    outlineX += (mouseX - outlineX) * 0.15;
    outlineY += (mouseY - outlineY) * 0.15;
    outline.style.left = `${outlineX}px`;
    outline.style.top = `${outlineY}px`;
    requestAnimationFrame(animate);
  }
  animate();

  // Hover + click feedback
  const hoverables = document.querySelectorAll("a, button, .project-card, img, video");
  hoverables.forEach(el => {
    el.addEventListener("mouseenter", () => {
      outline.classList.add("cursor-hover");
    });
    el.addEventListener("mouseleave", () => {
      outline.classList.remove("cursor-hover");
    });
  });

  document.addEventListener("mousedown", () => {
    outline.classList.add("cursor-clicked");
  });
  document.addEventListener("mouseup", () => {
    outline.classList.remove("cursor-clicked");
  });
});
