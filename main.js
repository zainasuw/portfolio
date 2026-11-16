// The page's small behaviours: the heroes who turn to look at you and cheer,
// the game window (a live game, loaded only when someone asks to play),
// and the phone preview for games that need a keyboard.

const GAMES = {
  dungeon: {
    title: "Dungeon Adventure",
    url: "https://zainasuw.github.io/dungeon-adventure/",
    hint: "Click the game, then W A S D to walk and F to attack",
    w: 960, h: 600,
  },
  jam: {
    title: "It’s a Feature, Not a Bug",
    url: "https://la-petite-baleine.github.io/TriCampusJam2026/",
    hint: "Click to play. When it asks, type your name and press Enter",
    w: 960, h: 540,
  },
};
const root = document.documentElement;

// Keyboard games need a keyboard: on touch-only devices, show the preview instead of the window.
const finePointer = matchMedia("(hover: hover) and (pointer: fine)");
const reduce = matchMedia("(prefers-reduced-motion: reduce)");
for (const el of document.querySelectorAll("[data-touch-href]")) {
  el.dataset.deskHref = el.getAttribute("href");
  el.dataset.deskLabel = el.querySelector("span").textContent;
}
function setInputMode() {
  const touchOnly = !finePointer.matches;
  root.classList.toggle("can-touch", touchOnly);
  for (const el of document.querySelectorAll("[data-touch-href]")) {
    el.setAttribute("href", touchOnly ? el.dataset.touchHref : el.dataset.deskHref);
    el.querySelector("span").textContent = touchOnly ? el.dataset.touchLabel : el.dataset.deskLabel;
  }
  const hint = document.querySelector(".heroes__hint");
  if (hint) hint.textContent = `The Warrior and the Thief, from my game. ${touchOnly ? "Tap" : "Click"} to say hi.`;
}
finePointer.addEventListener("change", setInputMode);
setInputMode();

// The heroes from her game turn to look at the pointer (frames rendered from the game's own models),
// and cheer when you say hi.
const heroes = document.querySelector(".heroes");
if (heroes) {
  const turn = heroes.querySelector(".heroes__turn");
  let cheer = null; // the cheer image is added on the first hello, so nothing loads before then
  const FRAMES = 21, COLS = 3, ROWS = 7;
  let target = 10, current = 10, ready = false, raf = 0, cheering = false;
  const show = (i) => {
    const col = i % COLS, row = Math.floor(i / COLS);
    turn.style.backgroundPosition = `${(col / (COLS - 1)) * 100}% ${(row / (ROWS - 1)) * 100}%`;
  };
  const tick = () => {
    current += (target - current) * 0.18;
    show(Math.round(current));
    raf = Math.abs(target - current) > 0.05 ? requestAnimationFrame(tick) : 0;
  };
  // the turn sheet loads after the page, and only where there is a pointer to follow
  const loadTurn = () => {
    if (!finePointer.matches || reduce.matches || ready) return;
    const img = new Image();
    img.onload = () => { turn.style.backgroundImage = `url(${img.src})`; show(10); ready = true; heroes.classList.add("is-turning"); };
    img.src = "images/home/heroes-look.webp";
  };
  if (document.readyState === "complete") loadTurn(); else addEventListener("load", loadTurn);
  addEventListener("pointermove", (e) => {
    if (!ready || cheering || e.pointerType !== "mouse") return;
    const r = heroes.getBoundingClientRect();
    const cx = r.left + r.width / 2; // as far as they can turn at either edge of the window
    const dx = (e.clientX - cx) / Math.max(1, e.clientX < cx ? cx : innerWidth - cx);
    target = Math.max(0, Math.min(FRAMES - 1, Math.round((Math.max(-1, Math.min(1, dx)) + 1) / 2 * (FRAMES - 1))));
    if (!raf) raf = requestAnimationFrame(tick);
  }, { passive: true });
  heroes.addEventListener("click", () => {
    if (reduce.matches || cheering) return;
    cheering = true;
    if (!cheer) { cheer = Object.assign(new Image(820, 466), { className: "heroes__cheer", alt: "" }); heroes.append(cheer); }
    cheer.src = "images/home/heroes-cheer.webp?" + Date.now(); // restart the animation
    cheer.hidden = false;
    heroes.classList.add("is-cheering");
    setTimeout(() => { cheer.hidden = true; heroes.classList.remove("is-cheering"); cheering = false; }, 3300);
  });
}

// Project index: hovering a name shows its screen beside the pointer
const peekLinks = document.querySelectorAll(".index a[data-peek]");
if (peekLinks.length && finePointer.matches) { // only where there is a mouse to hover with
  const peek = Object.assign(new Image(), { className: "peek", alt: "" });
  peek.setAttribute("aria-hidden", "true");
  peek.src = peekLinks[0].dataset.peek;
  document.querySelector(".hero").append(peek);
  for (const a of peekLinks) {
    a.addEventListener("pointerenter", (e) => {
      if (e.pointerType !== "mouse") return;
      peek.src = a.dataset.peek; peek.classList.add("is-on");
    });
    a.addEventListener("pointerleave", () => peek.classList.remove("is-on"));
    a.addEventListener("pointermove", (e) => { // kept fully inside the window
      const half = peek.offsetWidth / 2 + 12;
      peek.style.left = Math.max(half, Math.min(innerWidth - half, e.clientX)) + "px";
      peek.style.top = e.clientY + "px";
    });
  }
}

// The game window
const dialog = document.getElementById("game");
const frameBox = document.getElementById("game-frame");
const titleEl = document.getElementById("game-title");
const hintEl = document.getElementById("game-hint");
const fullLink = document.getElementById("game-full");
let opener = null;
let current = null;

function fitGame() {
  if (!current) return;
  const { w, h } = current;
  const s = Math.min(1, (innerWidth - 72) / w, (innerHeight - 150) / h);
  frameBox.style.setProperty("--fw", w + "px");
  frameBox.style.setProperty("--fh", h + "px");
  frameBox.style.setProperty("--gs", s.toFixed(4));
  frameBox.style.setProperty("--gw", Math.round(w * s) + "px");
  frameBox.style.setProperty("--gh", Math.round(h * s) + "px");
}

function openGame(id, trigger) {
  current = GAMES[id];
  if (!current) return;
  opener = trigger;
  titleEl.textContent = current.title;
  hintEl.textContent = current.hint;
  fullLink.href = current.url;
  fitGame();
  const iframe = document.createElement("iframe");
  iframe.src = current.url;
  iframe.title = current.title + ", the game";
  iframe.allow = "fullscreen; autoplay; gamepad";
  const note = Object.assign(document.createElement("p"), { className: "screen__loading" });
  note.setAttribute("role", "status"); // filled a frame later, so screen readers announce it
  requestAnimationFrame(() => { note.textContent = "Loading the game… If nothing appears, use “Open full game” above."; });
  iframe.addEventListener("load", () => { note.remove(); iframe.focus(); }, { once: true });
  frameBox.replaceChildren(note, iframe);
  dialog.showModal();
}

// Closing removes the game entirely, which stops its sound and rendering.
// Remove it first, then close, so nothing keeps running even for a moment.
function stopGame() {
  for (const f of frameBox.querySelectorAll("iframe")) { f.src = "about:blank"; f.remove(); }
  frameBox.replaceChildren();
}
function closeGame() {
  stopGame();
  if (dialog.open) dialog.close();
}
dialog.addEventListener("close", () => {
  stopGame(); // also covers Esc
  current = null;
  if (opener) opener.focus();
});
dialog.querySelector("[data-close]").addEventListener("click", closeGame);
addEventListener("resize", () => { if (dialog.open) fitGame(); });

for (const el of document.querySelectorAll("[data-play]")) {
  el.addEventListener("click", (e) => {
    if (root.classList.contains("can-touch")) return; // the link goes to the preview
    e.preventDefault();
    openGame(el.dataset.play, el);
  });
}

// Copy link for later (phones)
for (const btn of document.querySelectorAll("[data-copy]")) {
  btn.addEventListener("click", async () => {
    const status = btn.closest(".play-phone").querySelector(".copied");
    const url = location.href.split("#")[0] + btn.dataset.copy;
    try {
      await navigator.clipboard.writeText(url);
      status.textContent = "Link copied. Open it on a computer to play.";
    } catch {
      status.textContent = "Copy this link: " + url;
    }
  });
}

// The bar that appears after the first screen, with the section you are in marked
const rail = document.querySelector(".rail");
const firstScreen = document.querySelector(".hero");
if (rail && firstScreen) {
  const links = [...rail.querySelectorAll('a[href^="#"]')];
  const targets = links.map((a) => document.querySelector(a.getAttribute("href")));
  const mark = (link) => {
    for (const a of links) {
      if (a === link) a.setAttribute("aria-current", "true"); else a.removeAttribute("aria-current");
    }
  };
  let clicked = null, queued = false, settle = 0;
  const update = () => {
    queued = false;
    // shown once the first screen is all but behind it; the bar is the same teal, so a few last pixels never show a seam
    const on = firstScreen.getBoundingClientRect().bottom <= rail.offsetHeight + 24;
    if (!on && rail.contains(document.activeElement)) document.activeElement.blur();
    rail.classList.toggle("is-on", on);
    rail.inert = !on;
    if (clicked) { mark(clicked); return; } // a link just pressed stays marked until the visitor scrolls again
    // the reading line sits 40% down, and slides lower over the last stretch so short closing sections still get their turn
    const left = document.documentElement.scrollHeight - innerHeight - scrollY;
    const line = innerHeight * 0.4 + Math.max(0, innerHeight * 0.6 - left);
    let current = null;
    targets.forEach((t, i) => { if (t && t.getBoundingClientRect().top <= line) current = links[i]; });
    // the last section can be too short to reach the line, so the end of the page counts
    if (scrollY + innerHeight >= document.documentElement.scrollHeight - 2) current = links[links.length - 1];
    mark(current);
  };
  const request = () => { if (!queued) { queued = true; requestAnimationFrame(update); } };
  addEventListener("scroll", request, { passive: true });
  addEventListener("resize", request);
  // a pressed link stays marked while the page travels to it; any scroll after it has settled re-reads the page
  for (const a of links) a.addEventListener("click", () => { clicked = a; mark(a); clearTimeout(settle); settle = setTimeout(() => { settle = 0; }, 1500); });
  addEventListener("scroll", () => { if (clicked && !settle) clicked = null; }, { passive: true });
  addEventListener("scrollend", () => { clearTimeout(settle); settle = 0; }); // where the browser reports it, the travel ends exactly when it ends
  for (const type of ["wheel", "touchmove", "keydown", "pointerdown"]) addEventListener(type, (e) => { if (!e.target.closest || !e.target.closest(".rail")) clicked = null; }, { passive: true });
  update();
}
