const video = document.querySelector(".hero-video");
const toggle = document.querySelector(".video-toggle");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

function updateVideoControl() {
  toggle.textContent = video.paused ? "Play background video" : "Pause background video";
}

function playVideo() {
  video.play().catch(updateVideoControl);
}

toggle.hidden = false;
toggle.addEventListener("click", () => {
  if (video.paused) {
    playVideo();
  } else {
    video.pause();
  }
});
video.addEventListener("play", updateVideoControl);
video.addEventListener("pause", updateVideoControl);
video.addEventListener("error", () => {
  toggle.hidden = true;
});
reducedMotion.addEventListener("change", (event) => {
  if (event.matches) video.pause();
});
if (!reducedMotion.matches) playVideo();

if (window.gsap && window.ScrollTrigger) {
  gsap.registerPlugin(ScrollTrigger);
  gsap.matchMedia().add("(prefers-reduced-motion: no-preference)", () => {
    gsap.from(".hero-content", { opacity: 0, y: 24, duration: 0.85 });
    gsap.utils.toArray(".columns").forEach((series) => {
      gsap.from(series, {
        y: 24,
        duration: 0.65,
        scrollTrigger: { trigger: series, start: "top 92%", once: true },
      });
    });
  });
}
