// Future animations or interactions here
// Initialize Lenis (smooth scroll)
const lenis = new Lenis({
  lerp: 0.08, // easing (0 = no easing, 1 = super slow)
  smooth: true,
});

// Run on every animation frame
function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// Example GSAP animation: fade in .item elements when they appear
gsap.registerPlugin(ScrollTrigger);

gsap.utils.toArray('.item').forEach((item) => {
  gsap.from(item, {
    opacity: 0,
    y: 50,
    duration: 0.8,
    scrollTrigger: {
      trigger: item,
      start: 'top 90%',
      toggleActions: 'play none none none',
    },
  });
});
