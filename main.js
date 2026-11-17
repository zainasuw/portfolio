// The page's small behaviours: the heroes who turn to look at you and cheer,
// the game window and the games that wake up in place on their sheets (loaded only when someone asks to play),
// and the phone preview for games that need a keyboard.

// a small link out, the only words a slow or failed game shows
const outLink = (href, text) => Object.assign(document.createElement("a"), { href, target: "_blank", rel: "noopener", className: "out-link", innerHTML: text + ' <svg class="i" aria-hidden="true"><use href="#i-out"/></svg>' });
const GAMES = {
  dungeon: {
    title: "Dungeon Adventure",
    url: "https://zainasuw.github.io/dungeon-adventure/",
    opening: "images/home/dungeon-opening.webp", settle: 2600,
    hint: "Press Esc to close.",
    w: 960, h: 600,
  },
  jam: {
    title: "It’s a Feature, Not a Bug",
    url: "https://la-petite-baleine.github.io/TriCampusJam2026/",
    opening: "images/home/jam-title.webp", settle: 3600,
    hint: "Press Esc to close.",
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
    if (touchOnly && /^[^#]/.test(el.dataset.touchHref)) { el.target = "_blank"; el.rel = "noopener"; } else el.removeAttribute("target");
    el.querySelector("span").textContent = touchOnly ? el.dataset.touchLabel : el.dataset.deskLabel;
  }
  const hint = document.querySelector(".heroes__hint");
  if (hint) hint.textContent = reduce.matches ? "The Warrior and the Thief, from my game." : `The Warrior and the Thief, from my game. ${touchOnly ? "Tap" : "Click"} to say hi.`;
  const hs = document.querySelector(".heroes"); // standing still, they are a picture, not a button
  if (hs) { hs.classList.toggle("is-still", reduce.matches); hs.tabIndex = reduce.matches ? -1 : 0; hs.setAttribute("aria-label", reduce.matches ? "The Warrior and the Thief from my game Dungeon Adventure" : "Say hi to the Warrior and the Thief from my game Dungeon Adventure"); }
}
finePointer.addEventListener("change", setInputMode);
reduce.addEventListener("change", setInputMode);
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

// ---- The game window: the first screen's Play button opens Dungeon Adventure over the page ----
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
  note.classList.add("is-spinning");
  requestAnimationFrame(() => { if (!note.textContent) note.innerHTML = '<span class="vh">Loading the game</span>'; });
  // if the game is slow or cannot load here, say so and offer the way out
  const slow = setTimeout(() => { if (note.isConnected) { note.classList.remove("is-spinning"); note.replaceChildren("Still loading — ", outLink(current.url, "Open full game")); } }, 10000);
  // focus stays on the window's own buttons, so Esc closes it until you click into the game
  iframe.addEventListener("load", () => {
    clearTimeout(slow); note.remove();
    // a game kept inside this site can be listened to directly: until you reach for the game, Esc closes the window
    try {
      iframe.contentWindow.addEventListener("keydown", (e) => {
        if (e.key === "Escape") { e.preventDefault(); e.stopPropagation(); closeGame(); }
      }, true);
    } catch { /* a game on another site keeps its keys to itself */ }
  }, { once: true });
  const heardWindow = (e) => {
    if (e.source !== iframe.contentWindow || !e.data) return;
    if (e.data.type === "ready") { clearTimeout(slow); note.remove(); }
    else if (e.data.type === "escape") closeGame();
  };
  addEventListener("message", heardWindow);
  dialog.addEventListener("close", () => removeEventListener("message", heardWindow), { once: true });
  dialog.addEventListener("close", () => clearTimeout(slow), { once: true });
  // if the game can't be reached at all, say so instead of leaving an empty window
  const game = current;
  const failed = () => {
    if (current !== game || !dialog.open) return;
    clearTimeout(slow); iframe.remove(); frameBox.tabIndex = -1;
    note.classList.remove("is-spinning"); note.replaceChildren("Couldn’t load the game. ", outLink(game.url, "Open full game"));
    if (!note.isConnected) frameBox.append(note);
  };
  frameBox.replaceChildren(note, iframe);
  dialog.showModal();
  dialog.focus();
  frameBox.tabIndex = 0;
  if (navigator.onLine === false) failed(); else fetch(game.url, { mode: "no-cors" }).catch(failed);
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
// Some games take the keyboard as soon as they load. Unless the pointer is on the game (a click into it),
// the window takes the keyboard back, so Esc still closes the game.
// The keyboard's way in: Tab to the game and press Enter. That hands it the keyboard on purpose.
let handed = false;
frameBox.setAttribute("role", "group");
frameBox.setAttribute("aria-label", "The game. Press Enter to play it with the keyboard.");
frameBox.addEventListener("keydown", (e) => {
  const f = frameBox.querySelector("iframe");
  if (e.target !== frameBox || !f || (e.key !== "Enter" && e.key !== " ")) return;
  e.preventDefault(); handed = true; f.focus(); glass.classList.add("has-keys");
});
const glass = dialog.querySelector(".screen__glass");
// a pointer that just happens to rest where the game appears doesn't count as reaching for it
let moved = false;
dialog.addEventListener("pointermove", () => { moved = true; });
dialog.addEventListener("close", () => { moved = false; });
addEventListener("blur", () => {
  const byKey = handed; handed = false;
  const settle = () => {
    const f = frameBox.querySelector("iframe");
    if (!dialog.open || !f || document.activeElement !== f) return false;
    if (byKey || (moved && f.matches(":hover"))) glass.classList.add("has-keys"); // the game has the keyboard, and the bezel shows it
    else { window.focus(); dialog.focus(); } // take the keyboard back, so Esc closes the window
    return true;
  };
  if (!settle()) setTimeout(settle, 0); // most browsers already know by now; the rest a moment later
});
addEventListener("focus", () => glass.classList.remove("has-keys"));
dialog.addEventListener("focusin", () => glass.classList.remove("has-keys"));
dialog.addEventListener("close", () => glass.classList.remove("has-keys"));
dialog.querySelector("[data-close]").addEventListener("click", closeGame);
// A click outside the window closes it: the press has to start and end out there, so a slip while playing doesn't
const outside = (e) => { const r = dialog.getBoundingClientRect(); return e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom; };
let pressedOutside = false;
dialog.addEventListener("pointerdown", (e) => { pressedOutside = e.target === dialog && outside(e); });
dialog.addEventListener("click", (e) => { if (pressedOutside && e.target === dialog && outside(e)) closeGame(); pressedOutside = false; });
addEventListener("resize", () => { if (dialog.open) fitGame(); });


// ---- Play in place: a sheet's still screen becomes the game, right where it is ----
// Nothing of a game loads until Play is pressed. The still stays in front while the game wakes underneath,
// then gives way to the game's own first screen.
const stopIcon = '<svg class="i" aria-hidden="true"><use href="#i-close"/></svg>';
const announce = Object.assign(document.createElement("p"), { className: "vh" });
announce.setAttribute("role", "status");
document.body.append(announce);
let live = null; // { id, sheet, fig, btn, label, game, startedAt }
const barHeight = () => { const r = document.querySelector(".rail"); return r ? r.offsetHeight : 0; };

// How big the game can be here: never past its real size (so it stays sharp), and its name and buttons stay on screen.
function stageWidth(game, sheet, chrome) {
  const cs = getComputedStyle(sheet);
  const inner = sheet.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
  const room = innerHeight - barHeight() - 28 - chrome;
  return Math.min(inner, game.w + 16, 16 + room * game.w / game.h);
}
const roughChrome = 150; // title row, gaps and padding, before it can be measured
const tooSmall = (game, sheet) => (stageWidth(game, sheet, roughChrome) - 16) / game.w < 0.6;

function fitStage() {
  if (!live) return;
  const { sheet, fig, game } = live;
  const set = (w) => {
    sheet.style.setProperty("--stage-w", w + "px");
    sheet.style.setProperty("--stage-ar", game.w + " / " + game.h);
    const box = fig.querySelector(".live");
    if (box) box.style.setProperty("--gs", ((w - 16) / game.w).toFixed(4));
  };
  set(Math.max(320, stageWidth(game, sheet, roughChrome)));
  const chrome = sheet.offsetHeight - fig.querySelector("img").offsetHeight; // what the sheet needs besides the game
  set(Math.max(320, stageWidth(game, sheet, chrome)));
}

// The page changes shape in one motion: the screen grows where it stands, the blocks around it slide to make room,
// and the words change over without ghosting.
function reshape(change, dir, sheet) {
  if (reduce.matches || !document.startViewTransition) { change(); return Promise.resolve(); }
  const near = (el) => { const r = el.getBoundingClientRect(); return r.bottom > -innerHeight && r.top < innerHeight * 2; };
  const blocks = [...document.querySelectorAll(".work > *, .classwork, .skills, .contact, .foot")].filter(near);
  blocks.forEach((el, i) => { el.style.viewTransitionName = "block-" + i; });
  const text = sheet.querySelector(".sheet__text");
  const fig = sheet.querySelector(".cut--wide");
  if (text) text.style.viewTransitionName = "stage-text";
  if (fig) fig.style.viewTransitionName = "stage";
  root.dataset.vt = dir;
  const done = () => { blocks.forEach((el) => { el.style.viewTransitionName = ""; }); if (text) text.style.viewTransitionName = ""; if (fig) fig.style.viewTransitionName = ""; delete root.dataset.vt; };
  try {
    const t = document.startViewTransition(change);
    t.ready.catch(() => {}); // a newer motion may cut this one short; that is fine
    return t.finished.then(done, done);
  } catch { done(); change(); return Promise.resolve(); }
}

const IN_PLACE = false; // every Play opens the game in its window over the page (the owner's choice); in-sheet play is kept switched off
function playInPlace(id, btn, byKey = false) {
  const game = GAMES[id], sheet = document.getElementById(id);
  if (!game || !sheet) return;
  if (live && live.sheet === sheet) { if (performance.now() - live.startedAt > 600) stopPlaying(true); return; } // a double press is one press
  if (live) stopPlaying(false);
  const fig = sheet.querySelector(".cut--wide");
  fig.querySelectorAll(".live__note").forEach((n) => n.remove()); // a word left from an earlier try
  live = { id, sheet, fig, btn, label: btn.innerHTML, game, startedAt: performance.now() };
  const mine = live;
  const still = fig.querySelector("img");
  const box = Object.assign(document.createElement("div"), { className: "live" });
  const frame = document.createElement("iframe");
  frame.title = game.title + ", the game"; frame.allow = "fullscreen; autoplay; gamepad";
  frame.width = game.w; frame.height = game.h;
  // the game's own opening screen, shown while it wakes, so the still hands over to what is really coming
  const opening = Object.assign(new Image(), { className: "live__opening", alt: "", src: game.opening });
  const note = Object.assign(document.createElement("p"), { className: "live__note" });
  const say = (t) => { note.textContent = t; announce.textContent = t; };
  box.append(frame, opening);

  let failed = false;
  const fail = () => {
    if (live !== mine) return;
    failed = true;
    stopPlaying(false); // straight back to the still, with the word left on it
    note.replaceChildren("Couldn’t load the game. ", outLink(game.url, "Open full game"));
    announce.textContent = "The game couldn’t load here.";
    fig.append(note);
  };
  const ready = () => {
    if (live !== mine || !box.isConnected) return;
    fig.classList.add("is-live"); fig.classList.remove("is-waking");
    note.remove();
    let ours = false; try { ours = !!frame.contentWindow.document; } catch { ours = false; }
    if (ours) { // a game kept inside this site gets the keyboard at once, as on Poki and CrazyGames; Esc hands it back to Stop
      announce.textContent = "The game is ready. Press Esc to leave it.";
      const a = document.activeElement;
      if (a === btn || a === document.body || a === frame || (a && a.matches && a.matches("[data-poster]"))) frame.focus();
      if (byKey) { // keyboard players are told the one way out, once
        const tip = Object.assign(document.createElement("p"), { className: "live__note live__tip", textContent: "Esc to exit" });
        fig.append(tip); setTimeout(() => tip.remove(), 3200);
      }
    } else { // a game on another site can't hand Esc back, so the keyboard stays with the page until you click into it
      announce.textContent = "The game is ready. Stop playing is the button after it.";
      const handBack = () => { if (live === mine && !pointed && document.activeElement === frame) btn.focus(); };
      handBack(); setTimeout(handBack, 400); setTimeout(handBack, 1200);
    }
  };
  let pointed = false;
  box.addEventListener("pointerdown", () => { pointed = true; });

  reshape(() => {
    if (failed) return; // it already could not load: the sheet stays as it was
    sheet.classList.add("is-playing");
    fig.append(box);
    fitStage();
    btn.innerHTML = stopIcon + '<span class="vh">Stop playing</span>'; btn.classList.add("pill--icon"); btn.title = "Stop playing (Esc)";
    btn.setAttribute("role", "button");
    scrollTo({ top: sheet.getBoundingClientRect().top + scrollY - barHeight() - 14, behavior: "instant" });
  }, "in", sheet).then(() => {
    if (live !== mine || failed || fig.classList.contains("is-live")) return;
    fig.classList.add("is-waking");
    fig.append(note);
    announce.textContent = "Loading the game";
    const show = () => { if (live === mine) fig.classList.add("is-opening"); };
    if (opening.complete) show(); else opening.addEventListener("load", show, { once: true });
    setTimeout(() => { if (live === mine && note.isConnected && !fig.classList.contains("is-live") && box.isConnected) { note.replaceChildren("Still loading — ", outLink(game.url, "Open full game")); fig.append(note); } }, 10000);
  });

  // start loading at once, alongside the motion
  if (navigator.onLine === false) { queueMicrotask(fail); }
  else {
    frame.src = game.url;
    fetch(game.url, { mode: "no-cors" }).catch(fail);
    // the game is ready when it says so (a "ready" message), or a little after its page has loaded
    const heard = (e) => {
      if (e.source !== frame.contentWindow || !e.data) return;
      if (e.data.type === "ready") ready();
      else if (e.data.type === "escape" && live === mine) { stopPlaying(true); btn.focus(); } // Esc on the game's own title screen
    };
    addEventListener("message", heard);
    frame.addEventListener("load", () => setTimeout(ready, game.settle), { once: true });
    frame.addEventListener("load", () => { // a game kept inside this site: Esc stops it until you click into it
      try {
        frame.contentWindow.addEventListener("keydown", (e) => {
          if (e.key === "Escape" && live === mine) { e.preventDefault(); e.stopPropagation(); btn.focus(); } // out of the game, onto Stop; Esc again stops
        }, true);
      } catch { /* a game on another site keeps its keys to itself */ }
    }, { once: true });
  }
}

function stopPlaying(animated) {
  if (!live) return;
  const { sheet, fig, btn, label } = live;
  live = null; // it is over from this moment, whatever the motion is still doing
  const fold = () => {
    const before = sheet.getBoundingClientRect().bottom;
    for (const f of fig.querySelectorAll("iframe")) f.src = "about:blank";
    fig.querySelectorAll(".live, .live__note").forEach((n) => n.remove());
    fig.classList.remove("is-live", "is-waking", "is-opening");
    sheet.classList.remove("is-playing");
    btn.innerHTML = label; btn.removeAttribute("role"); btn.classList.remove("pill--icon"); btn.removeAttribute("title");
    if (before <= 0) scrollBy({ top: sheet.getBoundingClientRect().bottom - before, behavior: "instant" }); // nothing jumps if it folds above you
  };
  announce.textContent = "";
  if (animated) reshape(fold, "out", sheet); else fold();
}

addEventListener("resize", () => {
  if (!live) return;
  if (tooSmall(live.game, live.sheet)) { stopPlaying(false); return; } // too small to play in: back to the still
  fitStage();
  const r = live.sheet.getBoundingClientRect();
  if (r.top < barHeight() || r.top > innerHeight * 0.4 || r.bottom > innerHeight) scrollBy({ top: r.top - barHeight() - 14, behavior: "instant" });
});
addEventListener("keydown", (e) => {
  if (!live) return;
  if (e.key === "Escape" && !dialog.open) { const b = live.btn; stopPlaying(true); b.focus(); }
  else if (e.key === " " && e.target === live.btn) { e.preventDefault(); stopPlaying(true); } // it is a button while it says Stop
});
// A game left behind folds itself away, so nothing keeps running out of sight. It waits a moment first,
// so one stray Page Down doesn't end a game.
if ("IntersectionObserver" in window) {
  let leaving = 0;
  const away = new IntersectionObserver((entries) => {
    for (const en of entries) {
      if (!live || live.sheet !== en.target) continue;
      clearTimeout(leaving);
      if (!en.isIntersecting) leaving = setTimeout(() => { if (live && live.sheet === en.target) stopPlaying(false); }, 1500);
    }
  }, { rootMargin: "-44px 0px 0px 0px" });
  for (const s of document.querySelectorAll(".sheet")) away.observe(s);
}

// Pointing at Play only opens the connection, so the game starts sooner.
const warmed = new Set();
function warm(id) {
  const g = GAMES[id]; if (!g || warmed.has(id)) return; warmed.add(id);
  document.head.append(Object.assign(document.createElement("link"), { rel: "preconnect", href: new URL(g.url).origin }));
}
for (const el of document.querySelectorAll("[data-play]")) {
  el.addEventListener("pointerenter", () => warm(el.dataset.play), { once: true });
  el.addEventListener("focus", () => warm(el.dataset.play), { once: true });
  el.addEventListener("click", (e) => startPlay(el, e));
}
function startPlay(el, e) {
    if (root.classList.contains("can-touch")) return; // the link goes to the preview
    const id = el.dataset.play, sheet = document.getElementById(id), g = GAMES[id];
    const sheetBtn = sheet.querySelector(".play-desk [data-play]");
    if (Math.min((innerWidth - 72) / g.w, (innerHeight - 150) / g.h) < 0.6) return; // window too small for the game window: the link goes to the sheet, or opens the full game
    e.preventDefault();
    if (el === sheetBtn && IN_PLACE) { playInPlace(id, el, e.detail === 0); return; }
    // the first screen's button opens the game in its window, over the page
    if (live) stopPlaying(false);
    openGame(id, el);
}
// the play mark on a screenshot starts that sheet's game
for (const p of document.querySelectorAll("[data-poster]")) {
  const btn = document.querySelector(`#${CSS.escape(p.dataset.poster)} .play-desk [data-play]`);
  if (!btn) continue;
  p.addEventListener("pointerenter", () => warm(p.dataset.poster), { once: true });
  p.addEventListener("click", (e) => startPlay(btn, e));
}
// fullscreen, for the game in a sheet and in the window
const canFull = document.fullscreenEnabled || document.webkitFullscreenEnabled;
const goFull = (f) => { if (!f) return; (f.requestFullscreen || f.webkitRequestFullscreen).call(f); };
for (const b of document.querySelectorAll("[data-fullscreen], #game-fs")) {
  if (!canFull) { b.hidden = true; continue; }
  b.addEventListener("click", () => goFull(b.id === "game-fs" ? frameBox.querySelector("iframe") : b.closest(".sheet").querySelector(".cut--wide iframe")));
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
    rail.classList.toggle("is-on", on);
    links.slice(0, 2).forEach((a) => { if (on) a.removeAttribute("tabindex"); else a.tabIndex = -1; }); // they repeat the top links while the first screen shows
    if (clicked) { mark(clicked); return; } // a link just pressed stays marked until the visitor scrolls again
    // a section is current once its top passes the reading line, 40% down; the last one gets a line at 50% and the end of the page
    const left = document.documentElement.scrollHeight - innerHeight - scrollY;
    const last = links.length - 1;
    let current = null;
    targets.forEach((t, i) => { if (t && t.getBoundingClientRect().top <= innerHeight * (i === last ? 0.5 : 0.4)) current = links[i]; });
    if (left <= 2) current = links[last];
    // at the end of the page the last two sections can share the screen: keep the one the visitor asked for while it is still in view
    const asked = links.find((a) => a.getAttribute("href") === location.hash);
    const i = links.indexOf(asked);
    if (asked && i >= last - 1 && left < innerHeight * 0.6 && targets[i] && targets[i].getBoundingClientRect().top >= 0) current = asked;
    mark(current);
  };
  const request = () => { if (!queued) { queued = true; requestAnimationFrame(update); } };
  addEventListener("scroll", request, { passive: true });
  addEventListener("resize", request);
  // a pressed link stays marked while the page travels to it; when the travel ends the page is read again
  const arrived = () => { clearTimeout(settle); settle = 0; clicked = null; request(); };
  for (const a of links) a.addEventListener("click", () => { clicked = a; mark(a); clearTimeout(settle); settle = setTimeout(arrived, 1500); });
  addEventListener("scrollend", () => { if (clicked) arrived(); });
  for (const type of ["wheel", "touchmove", "keydown", "pointerdown"]) addEventListener(type, (e) => { if (!e.target.closest || !e.target.closest(".rail")) clicked = null; }, { passive: true });
  update();
}

// The first screen has depth: the name and the heroes shift a little against each other as the pointer moves.
if (firstScreen && finePointer.matches && !reduce.matches) {
  firstScreen.addEventListener("pointermove", (e) => {
    const r = firstScreen.getBoundingClientRect();
    firstScreen.style.setProperty("--px", ((e.clientX - r.left) / r.width * 2 - 1).toFixed(3));
    firstScreen.style.setProperty("--py", ((e.clientY - r.top) / r.height * 2 - 1).toFixed(3));
  }, { passive: true });
  firstScreen.addEventListener("pointerleave", () => { firstScreen.style.setProperty("--px", 0); firstScreen.style.setProperty("--py", 0); });
}
// A scene's stickers are pressed onto the sheet once, when most of it is in view. Arriving straight at it
// (a link, or coming back from its story) finds them already in place.
{
  const scenes = [...document.querySelectorAll(".sheet--scene")];
  const nav = performance.getEntriesByType("navigation")[0];
  const arrived = location.hash || (nav && nav.type === "back_forward") || !("IntersectionObserver" in window);
  if (arrived) scenes.forEach((s) => s.classList.add("is-stuck", "is-settled"));
  else {
    const press = new IntersectionObserver((entries) => {
      for (const en of entries) if (en.isIntersecting) { en.target.classList.add("is-stuck"); press.unobserve(en.target); }
    }, { threshold: 0.55 });
    scenes.forEach((s) => press.observe(s));
  }
}
// A story page's Play button comes back here and starts the game in place.
{
  const want = new URLSearchParams(location.search).get("play");
  const btn = want && document.querySelector(`#${CSS.escape(want)} .play-desk [data-play]`);
  if (want) addEventListener("load", () => setTimeout(() => { if (btn && !live && !root.classList.contains("can-touch")) btn.click(); history.replaceState(null, "", location.pathname + location.hash); }, 350));
}

// Smooth scrolling starts after the page has arrived, so coming back to a section lands there at once.
addEventListener("load", () => requestAnimationFrame(() => root.classList.add("smooth")));

// ---- Just for play: Light the hall. One light, and everything in the hall answers to it. ----
const hall = document.getElementById("torch");
if (hall) {
  const dark = hall.querySelector(".torch__heroes--dark"), lit = hall.querySelector(".torch__heroes--lit");
  const say = hall.querySelector(".torch__say"), again = document.getElementById("torch-reset");
  const SCONCES = [[16, 20], [50, 12], [84, 20]]; // where the wall torches hang, in percent
  const sconces = SCONCES.map(([x, y], i) => {
    const el = Object.assign(document.createElement("span"), { className: "torch__sconce" });
    el.style.left = x + "%"; el.style.top = y + "%"; el.setAttribute("aria-hidden", "true"); hall.append(el); return el;
  });
  let x = 50, y = 38, lit3 = [false, false, false], loaded = false, done = false, gl = null;
  const FR = 21, COLS = 3, ROWS = 7;
  const place = () => {
    hall.style.setProperty("--lx", x + "%"); hall.style.setProperty("--ly", y + "%");
    // the heroes stand in the lower middle: light falls on them from wherever the torch is, and their shadow leans away
    const r = hall.getBoundingClientRect(), hr = lit.getBoundingClientRect();
    const px = r.left + r.width * x / 100, py = r.top + r.height * y / 100;
    lit.style.setProperty("--hx", ((px - hr.left) / hr.width * 100).toFixed(1) + "%");
    lit.style.setProperty("--hy", ((py - hr.top) / hr.height * 100).toFixed(1) + "%");
    const cx = hr.left + hr.width / 2, cy = hr.top + hr.height * 0.6, dx = cx - px, dy = cy - py, d = Math.hypot(dx, dy) || 1;
    const len = Math.min(46, 10 + d * 0.09);
    hall.style.setProperty("--sx", (dx / d * len).toFixed(1) + "px"); hall.style.setProperty("--sy", (Math.max(0.25, dy / d) * len).toFixed(1) + "px");
    // and they turn to look at it
    const f = Math.max(0, Math.min(FR - 1, Math.round(x / 100 * (FR - 1)))), col = f % COLS, row = Math.floor(f / COLS);
    const pos = `${(col / (COLS - 1)) * 100}% ${(row / (ROWS - 1)) * 100}%`;
    dark.style.backgroundPosition = pos; lit.style.backgroundPosition = pos;
    if (gl) gl.wake();
  };
  const tell = (t) => { say.textContent = t; };
  const load = () => { // the heroes arrive only when the hall is about to be seen
    if (loaded) return; loaded = true;
    const img = new Image();
    img.onload = () => { for (const el of [dark, lit]) el.style.backgroundImage = `url(${img.src})`; place(); tell(finePointer.matches ? "Your pointer is the torch. Click to light a wall torch." : "Drag the torch. Tap to light a wall torch."); };
    img.src = "images/home/heroes-look.webp";
    // Where the browser can, the heroes are the game's real models, lit by a real light, and their heads follow it.
    // The pictures above stay as the fallback.
    const state = { get x() { return x; }, get y() { return y; }, get lit() { return lit3; }, get done() { return done; }, reduce: reduce.matches };
    import("./play/hall.js").then((m) => m.mount(hall, state, "play/models/")).then((g) => { gl = g; }).catch(() => {});
  };
  const light = () => {
    if (done) return;
    // the nearest unlit wall torch within reach catches
    let best = -1, bd = 26;
    SCONCES.forEach(([sx, sy], i) => { const d = Math.hypot(sx - x, (sy - y) * 0.625); if (!lit3[i] && d < bd) { bd = d; best = i; } });
    if (best < 0) { tell("Hold the torch up to one of the three wall torches."); return; }
    lit3[best] = true; sconces[best].classList.add("is-lit"); hall.style.setProperty("--t" + (best + 1), 1);
    const n = lit3.filter(Boolean).length;
    hall.style.setProperty("--lit", (n / 3 * 0.85).toFixed(2));
    again.hidden = false; if (gl) gl.wake(2500);
    if (n < 3) { tell(n === 1 ? "One lit. Two to go." : "Two lit. One to go."); return; }
    done = true; tell("The hall is lit!");
    if (gl) { gl.wake(4500); return; } // the real models cheer by themselves
    if (!reduce.matches) { // they cheer, with the cheer from the game
      const cheer = Object.assign(new Image(), { className: "torch__cheer", alt: "", src: "images/home/heroes-cheer.webp?" + Date.now() });
      cheer.onload = () => { hall.classList.add("is-cheering"); hall.append(cheer); setTimeout(() => { cheer.remove(); hall.classList.remove("is-cheering"); }, 3300); };
    }
  };
  const move = (e) => { const r = hall.getBoundingClientRect(); x = Math.max(2, Math.min(98, (e.clientX - r.left) / r.width * 100)); y = Math.max(6, Math.min(94, (e.clientY - r.top) / r.height * 100)); place(); };
  hall.addEventListener("pointermove", (e) => { hall.classList.add("is-held"); move(e); });
  hall.addEventListener("pointerdown", (e) => { hall.classList.add("is-held"); move(e); if (e.pointerType !== "mouse") hall.setPointerCapture(e.pointerId); });
  hall.addEventListener("pointerleave", () => hall.classList.remove("is-held"));
  hall.addEventListener("click", light);
  hall.addEventListener("keydown", (e) => {
    const step = { ArrowLeft: [-4, 0], ArrowRight: [4, 0], ArrowUp: [0, -5], ArrowDown: [0, 5] }[e.key];
    if (step) { e.preventDefault(); x = Math.max(2, Math.min(98, x + step[0])); y = Math.max(6, Math.min(94, y + step[1])); hall.classList.add("is-held"); place(); }
    else if (e.key === "Enter" || e.key === " ") { e.preventDefault(); light(); }
  });
  hall.addEventListener("blur", () => hall.classList.remove("is-held"));
  again.addEventListener("click", () => {
    lit3 = [false, false, false]; done = false; sconces.forEach((s) => s.classList.remove("is-lit"));
    for (const k of ["--t1", "--t2", "--t3"]) hall.style.setProperty(k, 0);
    hall.style.setProperty("--lit", 0); again.hidden = true; tell("Dark again."); hall.focus(); if (gl) gl.wake();
  });
  addEventListener("resize", place);
  if ("IntersectionObserver" in window) new IntersectionObserver((en, ob) => { if (en[0].isIntersecting) { load(); ob.disconnect(); } }, { rootMargin: "400px" }).observe(hall); else load();
}
