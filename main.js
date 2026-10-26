// Mobile menu, and marking the nav link for the section currently on screen.

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
