# Git cheat sheet — an animated guide

A single-page, vanilla HTML/CSS/JavaScript website that explains the eleven core
Git and GitHub concepts from the course slide. Each concept gets:

- **What it does** — a plain-language explanation.
- **Considerations** — practical advice and gotchas from real-world usage.
- **An animated SVG visual** — built with hand-rolled SVG and animated with
  [GSAP](https://gsap.com).
- **Resources** — links to authoritative documentation and popular tutorials.

The concepts covered are:

1. Repository (repo)
2. Clone
3. Branch
4. Commit
5. Push / Pull
6. Diff
7. Merge
8. Rebase
9. Merge conflict
10. Pull Request (PR)
11. Issue

## Running it

There is no build step. You can simply open `index.html` in a browser, but
because GSAP is loaded over HTTPS from a CDN you'll want a real local server
(otherwise some browsers complain about mixed content from `file://`).

The simplest options:

```bash
# Python 3
python -m http.server 8080

# Node (one-shot, no install)
npx --yes serve .

# VS Code
# Install the "Live Server" extension and click "Go Live".
```

Then visit <http://localhost:8080>.

## File layout

```
.
├── index.html   # markup for the page + every concept section
├── styles.css   # editorial cream-and-ink theme
├── script.js    # one GSAP timeline per concept, driven by ScrollTrigger
└── README.md    # this file
```

## How the animations work

- The page loads `gsap` and `ScrollTrigger` from a CDN.
- Each concept `<section>` carries a `data-anim="..."` attribute.
- `script.js` matches that attribute to a builder function which constructs a
  paused GSAP timeline scoped to that section.
- `ScrollTrigger` plays the timeline the first time the section scrolls into
  view (and re-plays it on scroll-back).
- Each visual has a **Replay** button which calls `timeline.restart()`.
- The site honours `prefers-reduced-motion` — when set, every timeline is
  snapped to its final state instead of being animated.

If you want to add or tweak a concept, the pattern is:

1. Add a new `<section class="concept" data-anim="myKey">` in `index.html`.
2. Add a `myKey(section) { … }` builder to the `builders` object in
   `script.js`. Return a paused `gsap.timeline(...)`.
3. Done — the binding code at the bottom of `script.js` picks it up
   automatically.

## Credits

- Built as part of the **AI & Design Systems** course.
- Source slide for the concepts is the *Git cheat sheet* from the course.
- Animations: [GSAP](https://gsap.com) + ScrollTrigger.
- Typography: [Fraunces](https://fonts.google.com/specimen/Fraunces),
  [Inter](https://fonts.google.com/specimen/Inter), and
  [JetBrains Mono](https://fonts.google.com/specimen/JetBrains+Mono) via
  Google Fonts.

## License

The code is provided for learning purposes — feel free to fork it, remix it,
and use it in your own notes.
