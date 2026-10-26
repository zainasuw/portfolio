// The five artifact cards. This is the only file to edit when you finish an artifact.
//
// To fill in a card:
//   1. change status from "idea" to "built"
//   2. write the title, link, reflection and tags
//   3. save, commit, push
//
// While status is "idea", the card shows the idea text and a "Planned" label.

const cards = [
  {
    number: 1,
    name: "Your Portfolio",
    status: "built",
    title: "This site",
    link: "https://zainasuw.github.io/portfolio/",
    code: "https://github.com/zainasuw/portfolio",
    reflection:
      "Built in one evening. The first version came out too plain, and it took a few rounds to get to something that looks professional. The cards load from one small file, so adding the next artifact is a two minute edit.",
    tags: ["HTML", "CSS", "JavaScript", "GitHub Pages"],
    idea: "",
  },
  {
    number: 2,
    name: "Something You Will Use",
    status: "built",
    title: "UXAudit",
    link: "https://github.com/zainasuw/uxaudit",
    code: "https://github.com/zainasuw/uxaudit",
    reflection: "",
    tags: ["TypeScript", "Node.js", "Playwright"],
    idea: "",
  },
  {
    number: 3,
    name: "AI Inside It",
    status: "built",
    title: "UXAudit — AI design review",
    link: "https://cvdvnu-uxaudit.hf.space",
    code: "https://github.com/zainasuw/uxaudit",
    reflection: "",
    tags: ["TypeScript", "Node.js", "Playwright", "Gemini API"],
    idea: "",
  },
  {
    number: 4,
    name: "For Someone Else",
    status: "idea",
    title: "",
    link: "",
    code: "",
    reflection: "",
    tags: [],
    idea: "A study group finder for UW Tacoma classes, so nobody has to ask in the group chat.",
  },
  {
    number: 5,
    name: "The Moonshot",
    status: "idea",
    title: "",
    link: "",
    code: "",
    reflection: "",
    tags: [],
    idea: "Finish HuskyHub and get it into the hands of real students.",
  },
];
