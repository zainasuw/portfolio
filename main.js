// Draws the artifact cards and progress meter from the list in cards.js,
// highlights the current section in the side nav, and runs the theme picker.

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text) node.textContent = text;
  return node;
}

function link(href, text, className) {
  const a = el("a", className, text);
  a.href = href;
  return a;
}

function pad(n) {
  return String(n).padStart(2, "0");
}

function artifactCard(card) {
  const isBuilt = card.status === "built";
  const article = el("article", isBuilt ? "card" : "card card--planned");
  article.id = "artifact-" + card.number;

  const eyebrow = el("p", "card__eyebrow");
  eyebrow.append(
    el("span", "card__num", "Artifact " + pad(card.number)),
    el("span", isBuilt ? "pill pill--on" : "pill", isBuilt ? "Shipped" : "Planned")
  );
  article.append(eyebrow);

  const top = el("div", "card__top");
  const title = el("h3", "card__title");
  if (isBuilt && card.link) {
    const a = link(card.link, card.title + " ");
    const arrow = el("span", "", "↗");
    arrow.setAttribute("aria-hidden", "true");
    a.append(arrow);
    title.append(a);
  } else {
    title.textContent = isBuilt ? card.title : card.name;
  }
  top.append(title);
  if (isBuilt && card.code) top.append(link(card.code, "Code", "card__aside"));
  article.append(top);

  article.append(el("p", "card__text", isBuilt ? card.reflection : card.idea));

  if (isBuilt && card.tags.length) {
    const tags = el("ul", "tags");
    for (const tag of card.tags) tags.append(el("li", "", tag));
    article.append(tags);
  }
  return article;
}

const cardsBox = document.getElementById("cards");
const meter = document.getElementById("meter");
let built = 0;

for (const card of cards) {
  const isBuilt = card.status === "built";
  if (isBuilt) built += 1;
  cardsBox.append(artifactCard(card));
  meter.append(el("span", isBuilt ? "meter__seg is-on" : "meter__seg"));
}

document.getElementById("count").textContent = built + " of " + cards.length + " shipped";

// Side nav: mark the section currently on screen.
const navLinks = document.querySelectorAll(".side__nav a");
if ("IntersectionObserver" in window) {
  const spy = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        for (const a of navLinks) {
          a.classList.toggle("is-active", a.getAttribute("href") === "#" + entry.target.id);
        }
      }
    },
    { rootMargin: "-30% 0px -60% 0px" }
  );
  document.querySelectorAll(".section").forEach((section) => spy.observe(section));
}

// Theme picker.
function setTheme(name) {
  document.documentElement.dataset.theme = name;
  for (const button of document.querySelectorAll("[data-set-theme]")) {
    button.setAttribute("aria-pressed", String(button.dataset.setTheme === name));
  }
  try {
    localStorage.setItem("theme", name);
  } catch (e) {}
}

let startTheme = new URLSearchParams(location.search).get("theme");
try {
  startTheme = startTheme || localStorage.getItem("theme");
} catch (e) {}
setTheme(startTheme || document.documentElement.dataset.theme);

for (const button of document.querySelectorAll("[data-set-theme]")) {
  button.addEventListener("click", () => setTheme(button.dataset.setTheme));
}
