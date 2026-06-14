const assets = [
  ["image", "img_8423.jpg"],
  ["video", "img_8424.mp4"],
  ["image", "img_8425.jpg"],
  ["image", "img_8428.jpg"],
  ["image", "img_8432.jpg"],
  ["image", "img_8435.jpg"],
  ["image", "img_8437.jpg"],
  ["image", "img_8439.jpg"],
  ["video", "img_8442.mp4"],
  ["video", "img_8443.mp4"],
  ["video", "img_8444.mp4"],
  ["video", "img_8445.mp4"],
  ["image", "img_8446.jpg"],
  ["image", "img_8448.jpg"],
  ["image", "img_8451.jpg"],
  ["image", "img_8452.jpg"],
  ["video", "img_8453.mp4"],
  ["image", "img_8454.jpg"],
  ["image", "img_8457.jpg"]
];

const gift = document.querySelector("#gift");
const unwrapButton = document.querySelector("#unwrapButton");
const reveal = document.querySelector("#reveal");
const audio = document.querySelector("#audio");
const playButton = document.querySelector("#playButton");
const progress = document.querySelector("#progress");
const currentTime = document.querySelector("#currentTime");
const duration = document.querySelector("#duration");
const mediaContainer = document.querySelector("#media");

let mediaIndex = -1;
let mediaTimer;

function formatTime(seconds) {
  if (!Number.isFinite(seconds)) return "0:00";
  return `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, "0")}`;
}

function updatePlayer() {
  const percentage = audio.duration ? (audio.currentTime / audio.duration) * 100 : 0;
  progress.value = percentage;
  progress.style.setProperty("--progress", `${percentage}%`);
  currentTime.textContent = formatTime(audio.currentTime);
  duration.textContent = formatTime(audio.duration);
}

function showNextMedia() {
  window.clearTimeout(mediaTimer);
  mediaIndex = (mediaIndex + 1) % assets.length;
  const [type, filename] = assets[mediaIndex];
  const element = document.createElement(type === "video" ? "video" : "img");
  element.className = "media-item entering";
  element.src = `assets/${filename}`;

  if (type === "video") {
    element.muted = true;
    element.autoplay = true;
    element.loop = true;
    element.playsInline = true;
  } else {
    element.alt = "Moment uit de opnamestudio";
  }

  mediaContainer.append(element);
  window.requestAnimationFrame(() => element.classList.remove("entering"));

  const previous = mediaContainer.querySelector(".media-item:not(:last-child)");
  if (previous) {
    previous.classList.add("leaving");
    window.setTimeout(() => previous.remove(), 750);
  }

  mediaTimer = window.setTimeout(showNextMedia, type === "video" ? 8500 : 5200);
}

function unwrap() {
  if (gift.classList.contains("opened")) return;
  gift.classList.add("unwrapping");
  window.setTimeout(() => {
    gift.classList.add("opened");
    reveal.setAttribute("aria-hidden", "false");
    showNextMedia();
    playButton.focus();
  }, 1050);
}

function toggleAudio() {
  if (audio.paused) {
    audio.play().catch(() => playButton.classList.remove("playing"));
  } else {
    audio.pause();
  }
}

unwrapButton.addEventListener("click", unwrap);
playButton.addEventListener("click", toggleAudio);
audio.addEventListener("loadedmetadata", updatePlayer);
audio.addEventListener("timeupdate", updatePlayer);
audio.addEventListener("play", () => {
  playButton.classList.add("playing");
  playButton.setAttribute("aria-label", "Liedje pauzeren");
});
audio.addEventListener("pause", () => {
  playButton.classList.remove("playing");
  playButton.setAttribute("aria-label", "Liedje afspelen");
});
audio.addEventListener("ended", () => {
  audio.currentTime = 0;
  updatePlayer();
});
progress.addEventListener("input", () => {
  if (audio.duration) audio.currentTime = (Number(progress.value) / 100) * audio.duration;
});

if (audio.readyState >= 1) updatePlayer();
