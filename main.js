// Mobile menu, the nav link for the section on screen, filtering projects by
// tag, and the architecture dialog.

const menu = document.querySelector(".menu");
const nav = document.getElementById("nav");

function setMenu(open) {
  nav.classList.toggle("is-open", open);
  menu.setAttribute("aria-expanded", String(open));
  menu.setAttribute("aria-label", open ? "Close menu" : "Open menu");
}

menu.addEventListener("click", () => setMenu(!nav.classList.contains("is-open")));
nav.addEventListener("click", (event) => {
  if (event.target.closest("a")) setMenu(false);
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && nav.classList.contains("is-open")) {
    setMenu(false);
    menu.focus();
  }
});

const sectionLinks = [...nav.querySelectorAll('a[href^="#"]')];
if ("IntersectionObserver" in window) {
  const spy = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        for (const a of sectionLinks) {
          if (a.getAttribute("href") === "#" + entry.target.id) a.setAttribute("aria-current", "true");
          else a.removeAttribute("aria-current");
        }
      }
    },
    { rootMargin: "-40% 0px -55% 0px" }
  );
  for (const a of sectionLinks) {
    const target = document.querySelector(a.getAttribute("href"));
    if (target) spy.observe(target);
  }
}

// Filter projects by tech tag. Clicking the active tag again clears it.
const projectsTitle = document.getElementById("projects-title");
const cards = [...document.querySelectorAll("#projects .card")];
const tagButtons = [...document.querySelectorAll("#projects .tag")];
const filterBar = document.getElementById("filter");
const filterName = document.getElementById("filter-name");
const filterCount = document.getElementById("filter-count");
let activeTag = null;

for (const button of tagButtons) button.setAttribute("aria-pressed", "false");

function applyFilter(tag) {
  activeTag = tag;
  let shown = 0;
  for (const card of cards) {
    const match = !tag || [...card.querySelectorAll(".tag")].some((b) => b.dataset.tag === tag);
    card.hidden = !match;
    card.classList.remove("is-entering");
    if (match) {
      shown += 1;
      void card.offsetWidth; // restart the fade-in
      card.classList.add("is-entering");
    }
  }
  for (const button of tagButtons) button.setAttribute("aria-pressed", String(button.dataset.tag === tag));
  filterBar.hidden = !tag;
  if (tag) {
    filterName.textContent = tag;
    filterCount.textContent = `${shown} of ${cards.length} projects`;
  }
  document.getElementById("projects").scrollIntoView({ behavior: "smooth", block: "start" });
}

for (const button of tagButtons) {
  button.addEventListener("click", () => applyFilter(activeTag === button.dataset.tag ? null : button.dataset.tag));
}
document.getElementById("filter-clear").addEventListener("click", () => {
  applyFilter(null);
  projectsTitle.focus({ preventScroll: true });
});

// Architecture dialog.
let dialogOpener = null;
for (const opener of document.querySelectorAll("[data-open-dialog]")) {
  opener.addEventListener("click", () => {
    const dialog = document.getElementById(opener.dataset.openDialog);
    dialogOpener = opener;
    dialog.showModal();
  });
}
for (const dialog of document.querySelectorAll(".dialog")) {
  dialog.querySelector(".dialog__close").addEventListener("click", () => dialog.close());
  // A click that lands on the dialog element itself is a click on the backdrop.
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });
  dialog.addEventListener("close", () => dialogOpener?.focus());
}
