---
name: Zainab Stanikzy · Portfolio
description: Her name, very large, with the two heroes from her own game turning to look at you; then one sticker sheet per project, and her games play right on the page.
colors:
  field-teal: "#24655f"
  cream: "#f7efe3"
  cream-soft: "#d8e8e3"
  pink-mode: "#ff5aa5"
  pink-mode-pressed: "#ff3d93"
  pink-type: "#d81f74"
  desk-grey: "#e8eceb"
  printed-ink: "#17132b"
  printed-ink-soft: "#4b4763"
  liner-white: "#ffffff"
  kiss-cut: "#b9bdcf"
  crypt-liner: "#251b2c"
  crypt-soft: "#d4c6b6"
  crypt-gold: "#f2c35b"
  jam-liner: "#ffe4f0"
  jam-soft: "#6b4058"
  lilac-liner: "#ece2ff"
  lilac-soft: "#574a74"
  stage-purple: "#1d1440"
  stage-soft: "#cfc6ee"
  window-hint: "#d9efec"
typography:
  display:
    fontFamily: "Bricolage Grotesque, sans-serif"
    fontSize: "clamp(64px, min(15.5vw, 27vh), 250px)"
    fontWeight: 800
    lineHeight: 0.84
    letterSpacing: "-0.045em"
    fontVariation: "'opsz' 96"
  headline:
    fontFamily: "Bricolage Grotesque, sans-serif"
    fontSize: "clamp(40px, 6vw, 88px)"
    fontWeight: 800
    lineHeight: 0.95
    letterSpacing: "-0.035em"
    fontVariation: "'opsz' 96"
  title:
    fontFamily: "Bricolage Grotesque, sans-serif"
    fontSize: "clamp(30px, 3.4vw, 46px)"
    fontWeight: 800
    lineHeight: 1
    letterSpacing: "-0.02em"
    fontVariation: "'opsz' 96"
  lede:
    fontFamily: "Hanken Grotesk, system-ui, sans-serif"
    fontSize: "clamp(17px, 1.4vw, 19px)"
    fontWeight: 400
    lineHeight: 1.5
  body:
    fontFamily: "Hanken Grotesk, system-ui, sans-serif"
    fontSize: "17px"
    fontWeight: 400
    lineHeight: 1.55
  label:
    fontFamily: "Hanken Grotesk, sans-serif"
    fontSize: "15px"
    fontWeight: 700
    lineHeight: 1
  small:
    fontFamily: "Hanken Grotesk, sans-serif"
    fontSize: "14px"
    fontWeight: 600
    lineHeight: 1.45
rounded:
  pill: "999px"
  sheet: "22px"
  sticker: "18px"
  print: "11px"
spacing:
  edge: "clamp(18px, 4vw, 64px)"
  margin: "clamp(18px, 2vw, 28px)"
  bar: "56px"
  sheet-pad: "clamp(22px, 3.4vw, 48px)"
  section: "clamp(64px, 9vw, 120px)"
components:
  pill-go:
    backgroundColor: "{colors.pink-mode}"
    textColor: "{colors.printed-ink}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "0 18px"
    height: "46px"
  pill-go-hover:
    backgroundColor: "{colors.pink-mode-pressed}"
    textColor: "{colors.printed-ink}"
  pill:
    backgroundColor: "{colors.liner-white}"
    textColor: "{colors.printed-ink}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "0 18px"
    height: "46px"
  pill-hover:
    backgroundColor: "{colors.printed-ink}"
    textColor: "{colors.liner-white}"
  pill-on-teal:
    backgroundColor: "transparent"
    textColor: "{colors.cream}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    height: "46px"
  pill-on-teal-hover:
    backgroundColor: "{colors.cream}"
    textColor: "{colors.printed-ink}"
  sheet:
    backgroundColor: "{colors.liner-white}"
    textColor: "{colors.printed-ink}"
    rounded: "{rounded.sheet}"
    padding: "{spacing.sheet-pad}"
  sticker:
    backgroundColor: "{colors.liner-white}"
    rounded: "{rounded.sticker}"
    padding: "8px"
  section-title:
    textColor: "{colors.printed-ink}"
    typography: "{typography.headline}"
  label-tab:
    backgroundColor: "{colors.printed-ink}"
    textColor: "{colors.liner-white}"
    rounded: "{rounded.sticker}"
---

# Design System: Zainab Stanikzy · Portfolio

## Overview

**Creative North Star: "Her Name, Her Heroes"**

The first screen makes one statement: Zainab's name, set very large in cream on a single flat teal field, with the Warrior and the Thief from her own game, Dungeon Adventure, standing in front of the end of it. They are real renders of the game's models, and they turn to follow the pointer and cheer when you say hi. Under them, one line on who she is, one pink action to play the game on the page, and the list of her projects as the way in.

Below the first screen the page becomes a desk of sticker sheets, one per project, each printed in that project's colour: real captures cut out as stickers with kiss cuts around them, her contribution in plain words, and the actions for that project. The TCSS 490 class work, skills and a LinkedIn invitation close the page.

It is playful because the work is (games, a dating sim, Pink Mode with glitter) and it stays professional through restraint: one display face, one field colour, pink only for actions, real material only, and nothing moving until the visitor does something.

**Key Characteristics:**
- One focal moment made from her own work: the name and the heroes.
- One display voice (Bricolage Grotesque 800) from the name down to the closing line.
- One flat committed colour owns the first screen; pink carries every primary action.
- Real material only: game renders and captures, each with a provenance sidecar.
- Things answer the hand; nothing moves at rest, and with reduced motion nothing moves at all.

## Colors

A flat teal field with cream type, a cool daylight desk below it, Pink Mode pink as the one loud voice, and dark printed ink for reading.

### Primary
- **Field Teal** (#24655f): the first screen's field, edge to edge, flat. Also the slim bar that appears after the first screen.
- **Cream** (#f7efe3): type on the teal field (5.9:1) and ink on the crypt liner.
- **Cream Soft** (#d8e8e3): secondary type on the teal field (5.3:1): the index's one-line descriptions and the heroes' hint.

### Secondary
- **Pink Mode** (#ff5aa5): fills for every primary action (Play, Try it live, Copy link, LinkedIn) with printed ink on top (6.2:1). Hovered or pressed it deepens to **Pink Mode Pressed** (#ff3d93).
- **Pink Type** (#d81f74): pink used as an icon or text on white (4.8:1), such as the plus on "How it's built".

### Neutral
- **Desk Grey** (#e8eceb): the ground under the sheets; cool, never cream.
- **Printed Ink** (#17132b): body text, outlined pills, label tabs, the closing line.
- **Printed Ink Soft** (#4b4763): facts lines and credits on white liners.
- **Liner White** (#ffffff): the default sheet liner and every sticker's cut border.
- **Kiss Cut** (#b9bdcf): dashed cut lines around each sticker on a white liner.

### Project liners
Each sheet is printed in its project's colour with its own soft ink and cut colour: **Crypt** (#251b2c, cream ink, Crypt Soft #d4c6b6, gold bullets #f2c35b) for Dungeon Adventure; **Jam Pink** (#ffe4f0, soft #6b4058) for It's a Feature, Not a Bug; **Lilac** (#ece2ff, soft #574a74) for Tetris's Pink Mode; **Stage Purple** (#1d1440, cream ink, soft #cfc6ee, gold bullets) for Scrawdle; **Liner White** for UXAudit and HuskyHub.

### Named Rules
**The Flat Field Rule.** The teal field is one flat colour, with no gradient and no texture; depth on the first screen comes only from the rendered heroes and their own shadows.
**The Ink-On-Pink Rule.** Pink fills always carry printed ink text (6.2:1), never white (2.9:1).

## Typography

**Display Font:** Bricolage Grotesque, variable, at optical size 96 (self-hosted, instanced to its optical-size and weight axes)
**Body Font:** Hanken Grotesk (system-ui fallback)

**Character:** a heavy grotesque with quirky, slightly ink-trapped details: confident at poster size, friendly without being childish. Hanken Grotesk is calm and open for everything people read.

### Hierarchy
- **Display** (800, clamp(64px, min(15.5vw, 27vh), 250px), 0.84, −0.045em): her name only, two lines. On tall screens clamp(56px, 19vw, 150px).
- **Headline** (800, clamp(40px, 6vw, 88px), 0.95, −0.035em, printed ink): the section titles ("Things I've made", "TCSS 490 artifacts", "Skills") and the closing line, "Let's build something together."
- **Title** (800, clamp(30px, 3.4vw, 46px), 1, −0.02em): project names on sheets; 24px for TCSS 490 artifacts; 18px for skill groups.
- **Lede** (400, clamp(17px, 1.4vw, 19px), 1.5, max 46ch) and the role line on the field (500, clamp(18px, 1.45vw, 22px), 1.45).
- **Body** (400, 17px, 1.55): lists at 15.5–17px, max about 52ch, `text-wrap: pretty`.
- **Label** (700, 15px): pills and nav links. **Small** (600, 13–14px): facts, keys, credits. Nothing functional below 11px.

### Named Rules
**The One Voice Rule.** Bricolage Grotesque 800 is the only display face, from the name to the closing line. No second display face, no bubble or novelty lettering.
**The Clean Break Rule.** Fact lines bind each "·" to the word before it, so no line starts with a separator; short labels use `text-wrap: balance`.

## Layout

The first screen fills the viewport (at least 640px tall) as a grid: the name spans the top; the heroes sit lower right over the end of "Stanikzy"; the role line and two pills sit lower left; a five-column project index runs along the bottom above a hairline. Side gutters are `max(clamp(18px, 4vw, 64px), (100% − 1840px) / 2)`, so on very wide screens the composition stays together and the top links align with it.

On tall screens (phones, and tablets held upright up to 1100px) the first screen stacks in reading order: name, heroes just under it (never covering it at phone sizes), the hint, the role, full-width pills, then the index as a list. Below 520px each index item puts its description under its name.

Below the first screen, content sits in a 1180px column with an 18–28px margin: sticker sheets in two columns (media and text; each sheet keeps its own side, mostly alternating), separated by clamp(28px, 4vw, 48px), with section openings of clamp(64px, 9vw, 120px). Dungeon Adventure gets the largest sheet. On narrow screens a sheet's overlapping stickers always clear the title below them.

## Elevation & Depth

Depth is physical and soft. On the first screen it comes only from the rendered heroes and their baked contact shadow. Below, stickers sit on liners and liners sit on the desk.

### Shadow Vocabulary
- **Resting sticker** (`0 1px 1px rgba(10,30,28,.25), 0 10px 22px -10px rgba(10,30,28,.5)`): stickers on sheets, label tabs.
- **Lifted** (`0 2px 2px rgba(10,30,28,.2), 0 26px 40px -16px rgba(10,30,28,.55)`): the hover peek of a project screen.
- **Liner** (`0 1px 2px rgba(0,0,0,.06), 0 24px 48px -32px rgba(23,19,43,.35)`): sheets and TCSS 490 cards on the desk.

### Named Rules
**The Hand Rule.** Motion and light appear only in answer to the visitor: the heroes turn toward the pointer, cheer on a click, Enter or tap, and a project's screen appears beside the pointer on hover. Nothing moves at rest.

## Shapes

Rounded, cut-from-vinyl forms: stickers have an 18px corner and an 8px white border around an 11px-rounded print; a 2px dashed kiss cut runs 8px outside each sticker; sheets are 22px; buttons and nav links are full pills.

## Components

### Buttons
- **Shape:** full pill (999px), 46px tall (56px for the closing LinkedIn).
- **Go (primary):** Pink Mode fill, printed ink text, drawn SVG icon (play, external arrow, link).
- **Pill (secondary):** white with a 1.5px printed-ink outline; hover inverts to ink.
- **On teal and on the crypt liner:** transparent with a cream outline; hover fills cream.

### The heroes (signature)
A button holding a still render of the Warrior and the Thief (820×466 frame). After the page loads, on devices with a mouse and without reduced motion, a 21-frame turn sheet (±38°) loads and the heroes turn to face the pointer across the whole window. Click, Enter or tap plays their cheer (rendered from the game's Cheer animation) once. The hint under them says "Click" or "Tap" to match the device.

### Project index
Five links along the bottom of the first screen: name (17px, 700) and a one-line kind and team (14px, cream soft), each kept on one line from 1000px wide; below 1200px they step down to 15px and 13px, and narrower landscape windows wrap onto two rows. Hovering a name with a mouse shows that project's real screen beside the pointer.

### Sticker sheet
A liner printed in the project's colour holding real captures as stickers (with kiss cuts), its title, a lede, a facts line, what she did, an optional "How it's built" fold-out, actions and a credit line.

### Label tab
The TCSS 490 cards (rendered by the untouched cards.js) wear a dark printed-ink tab on their top edge for number, assignment and status.

### Game window
A modal window with a dark bezel, the game's name and controls hint, "Open full game" and a white "Close game" pill. The live game loads only when opened, scales to fit, and is removed entirely on close or Esc. On touch devices, keyboard games show an inline preview instead: real screens in a swipe strip, a plain "Playing needs a keyboard" note and "Copy link for later".

### Game window extras
While a game loads, the window shows a short "Loading the game…" note. The page behind the window does not scroll while it is open.

### Navigation
Four quiet links top right on the field (Projects, TCSS 490, GitHub, LinkedIn), 15px bold, cream, with a faint pill tint on hover.

Once the first screen has scrolled away, a slim bar in Field Teal slides in along the top (36px tall; 44px on touch screens): Projects, TCSS 490, Skills and Contact, right-aligned to the same gutter, in Cream Soft at 14px/500. The section you are in turns Cream, bold and underlined. It is deliberately quieter than the other labels, carries no name, and its focus ring is a single inset Cream ring, since the two-tone ring would not fit inside it.

## Do's and Don'ts

### Do:
- **Do** keep the first screen to one focal moment: the name and the heroes.
- **Do** use real material only, and keep a provenance sidecar next to every shipped image.
- **Do** keep pink for actions, with printed ink on top.
- **Do** load a game only when someone asks to play it, and remove it completely on close.
- **Do** draw focus as a two-tone ring (3px printed ink plus a white halo).

### Don't:
- **Don't** put a gradient, texture or second colour on the teal field.
- **Don't** add a second display face or bubble lettering; the name is set, not decorated.
- **Don't** put an eyebrow or kicker above a heading.
- **Don't** imitate materials in CSS (brushed metal, bevels, embossing).
- **Don't** set white text on Pink Mode pink.
- **Don't** let anything move at rest; with reduced motion, nothing moves at all.
