const cursorDot = document.createElement('div');
cursorDot.classList.add('cursor-dot');
document.body.appendChild(cursorDot);

const cursorOutline = document.createElement('div');
cursorOutline.classList.add('cursor-outline');
document.body.appendChild(cursorOutline);

const cursorIcon = document.createElement('div');
cursorIcon.classList.add('cursor-icon');
cursorIcon.innerText = '+'; // Default icon
document.body.appendChild(cursorIcon);

let mouseX = 0, mouseY = 0;
let outlineX = 0, outlineY = 0;
const delay = 0.15;

function animateCursor() {
  requestAnimationFrame(animateCursor);
  outlineX += (mouseX - outlineX) * delay;
  outlineY += (mouseY - outlineY) * delay;

  cursorDot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
  cursorOutline.style.transform = `translate3d(${outlineX}px, ${outlineY}px, 0)`;
  cursorIcon.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
}

animateCursor();

document.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

document.querySelectorAll('a, button, .hover-target').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursorDot.classList.add('hovered');
    cursorOutline.classList.add('hovered');
    cursorIcon.classList.add('active');

    // Custom icon logic
    if (el.classList.contains('play-icon')) {
      cursorIcon.innerText = '▶';
    } else if (el.classList.contains('plus-icon')) {
      cursorIcon.innerText = '+';
    } else {
      cursorIcon.innerText = '+';
    }
  });

  el.addEventListener('mouseleave', () => {
    cursorDot.classList.remove('hovered');
    cursorOutline.classList.remove('hovered');
    cursorIcon.classList.remove('active');
    cursorIcon.innerText = '+'; // Reset to default
  });
});

document.addEventListener('mousedown', () => {
  cursorDot.classList.add('clicked');
  setTimeout(() => cursorDot.classList.remove('clicked'), 300);
});

// Hide default cursor
document.body.style.cursor = 'none';
