// Custom cursor logic
const dot = document.querySelector('.cursor-dot');
const outline = document.querySelector('.cursor-outline');
let mouseX = 0, mouseY = 0;
let outlineX = 0, outlineY = 0;

document.addEventListener('mousemove', e => {
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

function setIcon(icon) {
  if (icon) {
    dot.classList.add('has-icon');
    dot.textContent = icon;
  } else {
    dot.classList.remove('has-icon');
    dot.textContent = '';
  }
}

const images = document.querySelectorAll('img');
const videos = document.querySelectorAll('video');

images.forEach(img => {
  img.addEventListener('mouseenter', () => setIcon('+'));
  img.addEventListener('mouseleave', () => setIcon(null));
});

videos.forEach(vid => {
  vid.addEventListener('mouseenter', () => setIcon('▶'));
  vid.addEventListener('mouseleave', () => setIcon(null));
});
