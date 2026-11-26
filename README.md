# pyconcept: Sets & Gates Arcade

**Live site: https://pyconcept-delta.vercel.app**

[![Deployed on Vercel](https://img.shields.io/badge/Vercel-live-black?logo=vercel)](https://pyconcept-delta.vercel.app)

Sets & Gates Arcade is an interactive web app for learning two Python ideas by playing with them:

- **Venn simulator.** Python `set` operations, drawn as a Venn diagram.
- **Logic gates lab.** Python boolean logic (`and`, `or`, `not`), shown as a two-stage gate circuit.

It's a plain static site: HTML, CSS and JavaScript only. There's no build step, no framework and no dependencies.

---

## Features

### Venn simulator (`#venn`)
- Click any number to move it through *A only → both → B only → neither*.
- Light up the result of each operation and see the matching Python code:

  | Operation | Python |
  | --- | --- |
  | Union | `A \| B` |
  | Intersection | `A & B` |
  | Difference | `A - B`, `B - A` |
  | Symmetric difference | `A ^ B` |
  | Complements | `U - A`, `U - B`, `U - (A \| B)` |
  | Subset / superset | `A <= B`, `A >= B` |
  | Disjoint | `A.isdisjoint(B)` |

- Type your own sets, pick a random pair, or load a preset (evens vs multiples of 3, primes vs odds, and others).
- A Python console panel shows `>>>` lines for the current sets and the result.

### Logic gates lab (`#logic`)
- Click inputs **A**, **B** and **C** to switch them between `True` and `False`, and watch the signal travel through two gates.
- Each stage can use any of these gates: AND, OR, XOR, NAND, NOR, XNOR, NOT or BUF.
- The truth table updates live. Click a row to load those inputs.
- See the Python expression for the circuit, for example `(A and B) or C`.
- **Try your own expression:** a safe mini evaluator for Python-style one-liners such as `A and not B` or `0 or 5`. It shows that Python's `and` and `or` return one of their operands, not always `True` or `False`.

### Extras
- Sound effects made with the Web Audio API (no audio files), plus a falling-symbols background drawn on a canvas.
- Light, dark and auto themes.
- A **Customize** panel for colors, heading font, animation speed, background density, volume and waveform, universe size, set names, and truth-table symbols (1/0 or T/F). Settings are saved in `localStorage` under the key `sga`.
- Hash-based pages (`#home`, `#venn`, `#logic`), so no server rewrite rules are needed.
- Respects your device's `prefers-reduced-motion` setting.

---

## Project structure

```
pyconcept/
├── README.md                          ← you are here
└── pyconcept/
    └── sets-gates-arcade/
        └── sets-gates-arcade/         ← the deployed site (Vercel root directory)
            ├── index.html             markup
            ├── vercel.json            headers and caching config
            ├── README.md              notes for this folder
            └── assets/
                ├── app.js             all app logic (plain ES2020)
                ├── styles.css         styles
                └── favicon.svg        icon
```

> The top-level `pyconcept/index.html`, `app.js`, `styles.css` and `favicon.svg` are an older duplicate. That `index.html` loads files from `assets/`, which doesn't exist next to it, so that copy won't render correctly. Use the copy inside `sets-gates-arcade/sets-gates-arcade/`.

---

## Run locally

Any static file server works:

```bash
cd pyconcept/sets-gates-arcade/sets-gates-arcade
python3 -m http.server 8080
# open http://localhost:8080
```

You can also open `index.html` directly in a browser.

---

## Deployment

The site is hosted on **Vercel**: **https://pyconcept-delta.vercel.app**

| Setting | Value |
| --- | --- |
| Vercel project | `pyconcept` |
| Git repository | `GourvendrakumarJha/pyconcept` |
| Production branch | `main` |
| Root directory | `pyconcept/sets-gates-arcade/sets-gates-arcade` |
| Framework preset | Other (static) |
| Build / install command | none |

- Every push to `main` deploys the production site.
- Pushes to other branches and pull requests get their own preview URLs.

To deploy your own copy, import the repo in Vercel, set **Root Directory** to `pyconcept/sets-gates-arcade/sets-gates-arcade`, and leave the build settings empty.

---

## Browser support

Works in current versions of Chrome, Edge, Firefox and Safari. It uses CSS `color-mix()`, SVG, Canvas and the Web Audio API. Fonts (Orbitron and JetBrains Mono) load from Google Fonts.
