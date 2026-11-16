// TCSS 490 artifact cards. Built artifacts get a reflection and links; planned
// ones hold the idea. Adding the next artifact means editing one entry here.

const artifacts = [
  {
    number: 1,
    name: "Your Portfolio",
    status: "built",
    title: "This site",
    live: "https://zainasuw.github.io/portfolio/",
    code: "https://github.com/zainasuw/portfolio",
    reflection: "Built in one evening. The first version came out too plain, and it took a few rounds to get to something that looks professional. The cards load from one small file, so adding the next artifact is a two minute edit.",
  },
  {
    number: 2,
    name: "Something You Will Use",
    status: "built",
    title: "UXAudit",
    code: "https://github.com/zainasuw/uxaudit",
    reflection: "My first idea kept growing every session, and by the end I could run it but couldn’t explain how half of it worked or fix it when something broke. So I scrapped it and scoped down to UXAudit: screenshots and measured page checks, no AI yet. I could follow every piece, and that mattered once things started breaking.",
  },
  {
    number: 3,
    name: "AI Inside It",
    status: "built",
    title: "UXAudit: AI design review",
    live: "https://cvdvnu-uxaudit.hf.space",
    code: "https://github.com/zainasuw/uxaudit",
    reflection: "Adding the Gemini review took all of Saturday and into Sunday, and getting it online was its own fight: the free host ran out of memory, so I moved it to Hugging Face. Because I kept Artifact 2 small, I actually knew where to look when the deploy kept failing instead of just asking the AI to try again.",
  },
  {
    number: 4,
    name: "For Someone Else",
    status: "built",
    title: "Scrawdle",
    live: "https://scrawdle.vercel.app",
    code: "https://github.com/kevlam1/Scrawdle",
    reflection: "Scrawdle is a daily drawing game built by a team of four: everyone gets the same animal parts, draws the creature, then sees what everyone else drew. I owned the drawing engine and the drawing experience end to end. I built the canvas from scratch in vanilla JavaScript: six tools with multiple brush types, a memory-budgeted undo, auto-save to the browser that survives reloads (including a fix for Safari private windows), and a stroke-by-stroke replay that redraws every drawing pixel-exact. I then designed the game’s visual identity and shipped it across every screen: illustrated tool icons, the arcade-style drawing screen, dark mode, and responsive layouts that keep the canvas usable on laptops, split-screen windows and phones. Along the way I added sharing, reporting, My drawings, colorblind-friendly color names, and the lobby invite flow, each as its own small pull request, while coordinating with three teammates and their AI agents in one codebase.",
  },
  {
    number: 5,
    name: "The Moonshot",
    status: "progress",
    title: "HuskyHub",
    live: "https://huskyhub.app",
    reflection: "This week I turned my earlier campus app into a project real students can use. Instead of polishing the old interface, I redesigned it from scratch. My first round of four designs all failed for the same reason: they were crowded dashboards in different styles. Researching apps like Transit and Apple Weather taught me to lead with one clear answer. I rebuilt the Now and Rooms screens around that idea and put the app live on huskyhub.app.\n\nThe biggest lessons were about honesty in data. I found and fixed bugs where rooms vanished after 4pm because the server ran on UTC, rooms showed as free when they were actually unavailable, and outages looked like “nothing coming.” I also hardened security before going public with rate limits, input validation and a strict content security policy, and I kept a log of every plan and change in the repo.\n\nNext I’m polishing the interface based on design reviews (ranking rooms by how long they stay free, better night photos, a fuller laptop layout) and releasing the Buses and Food tabs, which are built and reviewed.",
  },
];

function linkButton(href, label, kind) {
  return `<a class="button button--sm button--${kind}" href="${href}" target="_blank" rel="noopener">${label} <span class="button__icon button__icon--up" aria-hidden="true">↗</span></a>`;
}

function artifactCard(a) {
  const built = a.status === "built";
  const inProgress = a.status === "progress";
  const hasReflection = built || inProgress;
  const links = [a.live && linkButton(a.live, "Live site", "primary"), a.code && linkButton(a.code, "GitHub", "ghost")]
    .filter(Boolean)
    .join("");
  return `
    <article class="artifact${hasReflection ? "" : " artifact--planned"}">
      <div class="artifact__meta">
        <p class="artifact__num">Artifact ${String(a.number).padStart(2, "0")}</p>
        <p class="artifact__name">${a.name}</p>
        <span class="badge${built ? "" : " badge--muted"}">${built ? "Shipped" : inProgress ? "In progress" : "Planned"}</span>
      </div>
      <div class="artifact__body">
        <h3 class="card__title">${a.title}</h3>
        <p class="artifact__label">${hasReflection ? "Reflection" : "Idea"}</p>
        ${(hasReflection ? a.reflection : a.idea).split("\n\n").map((t) => `<p>${t}</p>`).join("")}
        ${links && `<div class="card__actions">${links}</div>`}
      </div>
    </article>`;
}

document.getElementById("artifact-list").innerHTML = artifacts.map(artifactCard).join("");
