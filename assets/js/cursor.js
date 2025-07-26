const cursor = document.getElementById("cursor");
const follower = document.getElementById("cursor-follower");
const cursorIcon = document.getElementById("cursor-icon");

document.addEventListener("mousemove", (e) => {
  const { clientX: x, clientY: y } = e;
  cursor.style.left = `${x}px`;
  cursor.style.top = `${y}px`;
  follower.style.transform = `translate(${x}px, ${y}px)`;
});

document.querySelectorAll("a, .project-tile").forEach((el) => {
  el.addEventListener("mouseenter", () => {
    cursor.classList.add("hover");
    cursorIcon.textContent = "▶";
  });
  el.addEventListener("mouseleave", () => {
    cursor.classList.remove("hover");
    cursorIcon.textContent = "+";
  });
});

document.addEventListener("mousedown", () => {
  cursor.classList.add("click");
});
document.addEventListener("mouseup", () => {
  cursor.classList.remove("click");
});
