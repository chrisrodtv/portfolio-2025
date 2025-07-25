import { setCursorMode } from './cursor.js';

document.querySelectorAll('.nav-item').forEach(item => {
  item.addEventListener('mouseenter', () => {
    const mode = item.dataset.cursor || 'text';
    setCursorMode(mode);
  });
  item.addEventListener('mouseleave', () => {
    setCursorMode('default');
  });

  item.addEventListener('click', () => {
    const target = item.innerText.toLowerCase();
    window.location.href = `${target}.html`;
  });
});
