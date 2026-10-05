# IAIB — Ignite AI Buildathon

Landing page for the Ignite AI Buildathon, built in the visual language of
[resend.com](https://resend.com): white ground, hairline rules, dot-matrix
display type, and a tabbed code block.

## Files

- `index.html` — the entire page. No build step, no dependencies.

Everything is inline: CSS in a single `<style>` block at the top, markup in the
middle, two small IIFEs at the bottom (partner marquee + code tabs, curriculum
tabs). The only external requests are three Google Fonts.

## Run it

Open `index.html` in a browser, or serve the folder:

```
python3 -m http.server 3000
```

Then visit http://localhost:3000

## Deploy

Static — drop the folder on any host.

```
npx vercel --prod
```

## Design tokens

Defined once in `:root` at the top of the `<style>` block.

| Token | Value | Role |
| --- | --- | --- |
| `--bg` | `#000` | page ground |
| `--surface` | `#0a0a0a` | cards, grids |
| `--line` | `rgba(255,255,255,.08)` | hairline borders |
| `--fg` | `#f0f0f0` | primary text |
| `--fg-mid` | `#8c8c8c` | body copy, nav |
| `--fg-dim` | `#5a5a5a` | mono labels |
| `--accent` | `#f0402f` | IAIB red, used sparingly |

### Type

| Token | Face | Used for |
| --- | --- | --- |
| `--h1` | Helvetica | the `h1` only |
| `--display` | Bricolage Grotesque | `h2`, stat figures, module titles, footer wordmark |
| `--body` | Bricolage Grotesque | everything else |
| `--mono` | JetBrains Mono | the code block, filenames, chips, small labels |

Helvetica is a **system** face, not a webfont — there is no licensed version on
Google Fonts. Apple devices render real Helvetica; Windows and Android fall back to
Arial, which is metrically compatible but noticeably different in the `R`, `G`, `a`
and `t`. If the h1 has to look identical everywhere, the options are to license a
webfont (Helvetica Now, Neue Haas Grotesk) and self-host it, or to substitute a free
near-match such as Inter Tight.

JetBrains Mono is kept for genuinely monospaced content — the code sample depends on
it to line up, and the small chips read as code. Say the word and those move to
Bricolage too.

The h1 is set at 700 with `-0.035em` tracking, which is how Helvetica wants to be
set at display size; the previous serif held at 400 and needed far less negative
tracking. Bricolage headings run at 600 for the same reason — a grotesque at 400
reads as body copy when a serif at 400 still reads as a heading.

The page is dark only — no light theme, no toggle. `color-scheme: dark` on
`:root` so form controls and scrollbars follow.

A light build was made and reverted. Two things survive it. The body greys stay
lifted: `--fg-mid` is `#adadad` (9.4:1) and `--fg-dim` `#8f8f8f` (6.5:1), against
`#8c8c8c`/`#808080` before. And the contrast audit below, which the conversion
forced into existence.

### The contrast audit

Contrast is checked by resolving each element's effective background through
every layer up to the root — gradients and translucent fills composited — rather
than reading `backgroundColor`, which reports `transparent` for a gradient and so
silently measures text against the wrong ground. A naive walker produced 46 false
positives on this page, including the entire code block.

It has caught five real failures nothing else did: the Copy button at 4.3:1 on
its lifted surface, the curriculum numerals at 4.0:1 on their rows, the code
comment and punctuation colours against the panel, and — in both themes — the
selected curriculum file's session count, where the row's 7.5% tint shifts the
ground enough to drop the accent below the floor. All fixed. The page reports
zero failures against 4.5:1, or 3:1 at display sizes.

### Layout

One gutter, no centred rail: `.wrap` is full width with `padding-inline:
var(--gut)`, 120px, stepping to 72 / 40 / 28 / 20px as the viewport narrows —
120px would leave 135px of column on a phone. The gutter is a token because the
hero video's full-bleed margin is `calc(var(--gut) * -1)`.

### Decoration

There is none. The `Backed by` strip went too — it repeated the Government of
Karnataka lockup that already sits in the hero, and the hero took its vertical
space, filling the viewport below the nav (`min-height: min(840px, calc(100svh -
57px))`). The drifting code glyphs, seven glyph bands, tilted terminal
cards and three word marquees are gone, with their CSS and the `drift-*`,
`float-in` and `wslide` keyframes. The dot-matrix mask over the display type is
gone too — `h1`, `h2` and the CTA are plain type now. The one pixel bot crossing
the hero is the only ornament left.

### The headline

`Ignite AI Buildathon` is one unwrapped line, so its size is driven by viewport
width rather than the usual display scale: `clamp(1.75rem, 4.8vw, 4.3rem)`. The
binding case is not the widest screen but the narrowest two-column one, just
above the 1020px break, where the copy column is at its smallest relative to the
text. Measured at both ends, the line leaves 20px of slack in its column at
1440px and 20px at 1030px.

## Hero layout

Copy left, video right. The two are a grid rather than an absolutely-positioned
panel, so they can never overlap however the rail resizes; the video column
bleeds to the viewport edge with a negative margin instead:
`calc(((100vw - min(100vw,1100px)) / 2 + 24px) * -1)`. The first attempt used
`calc(50% - 50vw)`, which is the usual full-bleed idiom — but `50%` on a grid
item resolves against its own column, not the rail, and overshot the viewport by
294px.

### Merging the video into the page

Three things do it together:

1. **`mix-blend-mode: screen`.** On a black page every black pixel in the clip
   goes fully transparent, so the picture emerges out of the page rather than
   sitting on it — and the player's own black backdrop disappears with it.
2. **Edge masks.** Two gradients intersected, one across and one down, so every
   edge that stays on the page fades out. The only hard edge runs off the
   viewport, where it is never seen.
3. **Cover sizing in container units.** `max(100cqw, 100cqh * 16/9)` and its
   transpose, times 1.36. The cover maths means a 16:9 frame fills a box of any
   proportion with no letterboxing; the 1.36 pushes the player's title band and
   control strip beyond the visible edges.

This does not survive a theme flip. On white, `screen` washes out and `multiply`
paints the player's black backdrop as a dark slab — the exact box it removes on
black. A radial feather failed from the other side: whenever the player showed
black it became a dark ellipse floating in the white. On a light ground only the
masks work, and the clip reads as a video rather than as part of the page.

### What the embed costs

- **The player chrome cannot be removed.** `controls=0&modestbranding=1&rel=0`
  suppresses the control bar and related-video overlay, but the title band, the
  transport buttons and the end-screen suggestions are part of the player. The
  1.36 cover factor is what hides them.
- **The `autoplay` attribute is not enough.** Browsers decline it often enough
  that the hero showed a frozen play button. The IFrame API is loaded and
  `mute()` then `playVideo()` called on ready, which they do honour; `ENDED`
  seeks back to 0 rather than letting the end-screen grid appear.
- **Below 1020px it is hidden**, not dimmed. Stacked under the copy it is noise
  at any opacity.

A hosted `.mp4` removes every one of these. It is the right move if the file is
available.

### The lightbox

The hero clip is cropped, masked, scaled 1.36 and muted — it is wallpaper, not
something you can watch. The lightbox is where it becomes watchable: full 16:9,
real controls, sound.

Its iframe is **built on open and torn down on close**, so the full-size player
never loads behind the page and never keeps playing once dismissed. Opening also
pauses the hero clip, because two soundtracks at once is nobody's idea of a good
time, and restores it on close. It opens from the clip or from the bot; it closes
on the button, the backdrop or Escape; focus moves to the close button and
returns to wherever it came from; Tab cycles inside the dialog while it is up.

There is no sound toggle on the hero clip. There was one, and it was removed once
the lightbox existed — the clip stays silent and the lightbox carries the audio.

While it lived, it surfaced a real bug worth remembering: it began inside
`.hero-vid`, and a CSS mask clips hit-testing to its opaque areas. The button sat
77% down the box, inside the bottom fade, so scripted clicks fired the handler
and real pointer clicks were swallowed.

### The bot

One sprite, and it does one thing. It starts out by the headline, level with the
top of the clip, and walks to the centre of the clip over 2.5 seconds. Only when
it arrives does the thought cloud appear above it, saying what nothing else on
the page says: that the video opens.

The walk is `linear`. An earlier version used `cubic-bezier(.45,.05,.35,1)`,
which covered most of the distance in one second and crawled the rest — it read
as a lurch rather than a walk. A walking character moves at one speed, and the
`hop` keyframe already supplies the bob.

Two details that only show up in motion. The start position has to be painted
before the move is armed (`void walk.offsetWidth`), or the browser collapses both
style changes into one and nothing animates. And the sprite is hidden until it is
standing at its start, or it flashes at the field's top-left corner for the
900ms before the walk begins.

The cloud is CSS: a soft blob, two pseudo-elements bumping the top edge, and two
`<i>` circles trailing down to the bot thinking it. It bobs on a 3.6s loop.

On resize the bot snaps rather than re-walking. Under `prefers-reduced-motion` it
is simply placed, cloud already up. Below 1020px the clip is hidden and the bot
goes with it.

## Hero animation

Three layers, each lifted from a different reference.

### Masked line reveal (creativo-code.com)

The headline is split into `.line` / `.line-in` pairs. The outer element is clipped,
the inner one starts at `translateY(115%)` and slides up into the clip. Lines are
staggered 120ms apart.

The clip is a `clip-path: inset(...)` rather than `overflow: hidden`, and its bottom
edge jumps from `0` to `-400%` between the 99% and 100% keyframes. That matters: the
selection box hangs its handles and name tag *below* the text, and a permanent
`overflow: hidden` would crop them forever. Opening the clip in the last 1% of the
animation releases them with no JavaScript involved, so the resting state is correct
even if scripts never run.

`.grad` puts a `linear-gradient(90deg, ...)` behind the last line with
`background-clip: text`, the same technique the reference uses. It is currently IAIB
red to violet; the reference's own values are `#ff4885` to `#8154ff` if you want it
literal.

### Dot-matrix headline (vercel.com/ship)

The reference sets its headline in **GeistPixelCircle**, Vercel's proprietary pixel
face. That is not licensable, so the same LED-grid read is produced with a mask
instead:

```css
.dot{
  mask-image: radial-gradient(circle at 50% 50%, #000 44%, transparent 47%);
  mask-size: 5px 5px;
}
```

A tiled radial-gradient punches a dot grid out of whatever is behind it, so this
works on any typeface — Helvetica stays, and the gradient on "Buildathon" still
reads through the dots. Dots drop to 3.5px below 680px so the letterforms survive
at mobile headline sizes.

The mask is on `.dot` (the text) rather than the `h1`, because the selection box
and its handles live inside the heading and would otherwise be dotted too.

Masking removes roughly half the stroke mass, so the heading colour is pure white
rather than the off-white used elsewhere, to compensate.

### Notched buttons

`.btn-notch` carries the stepped "ticket stub" corners, the one thing from the
reference that could be copied outright — its `clip-path` polygon, parameterised
on `--n`. Note that `clip-path` also clips the box-shadow, so the primary button's
glow does not survive the notch; the reference has no shadow either.

### Event meta grid

Two mono columns under the buttons: place and format on the left, date and the
live clock on the right, in the reference's dot-separated `03D.17H.33M.14S`
format.

The hero stays centre-aligned. The reference is left-aligned, which is a large
part of its character — say the word if you want that too.

### The hero figures (Hairline)

Three interactive isometric figures from **[@lucasmarkes/hairline](https://hairline.lucasmarkes.com)**
v0.2.0 (MIT), one per stage of the programme:

| Figure | Caption | What it does |
| --- | --- | --- |
| `terminal` | Learn | the pointer's height scrolls back through its history |
| `branches` | Build | the commit under the pointer rises, and its history after it |
| `cabinet` | Ship | the pointer pulls the nearest blades out on their rails |

**Not the React entry.** The package ships two: `./react` needs React 18 as a peer,
and `.` is plain DOM — "for anything with a DOM". This page is one static HTML file
with no build step, so it uses the plain-DOM entry from a `<script type="module">`:

```js
import { terminal, branches, cabinet } from "./hairline.js";
terminal(document.getElementById('fig-a'), { intensity: 0.65, label: "..." });
```

**Vendored, not CDN'd.** `hairline.js` is the package's `dist/index.js` copied into
the project, with a header naming the source and licence; `LICENSE-hairline.txt`
sits beside it. It is dependency-free ESM, so it drops in as-is. This keeps the
page working offline and removes a runtime dependency on a third-party CDN.

**Theming.** The library exposes six custom properties, set once on `.figs`:
`--hairline-plate` (set to `#000`, matching the page — the docs are explicit that
this is the one to get right, since plates are filled, not transparent), plus
`hi`, `edge`, `mid`, `lo` and `stroke`. The middle figure overrides
`--hairline-hi` to the accent, which is where the page's one colour lands.

The library handles its own reduced-motion, off-screen idling, and shares one
`requestAnimationFrame` loop across every figure.

**Note for testing:** the figures ignore synthetic `PointerEvent`s. Verifying the
interaction needs a real pointer — dispatching events in the console reads as no
response and looks like a bug that isn't one.

## Between-section elements

Lifted from iaib.vercel.app's own element system, in this page's type and palette,
at the same points in the page.

**Glyph bands** (`.gband`) — seven of them, each before a section heading, matching
where the live site puts its scattered code glyphs:

| Before | Glyphs |
| --- | --- |
| Code | `const` `=>` `{ }` `</>` `const` |
| Rewards | `</>` `play()` `{ }` `play()` |
| How it works | `npm run` `</>` `=>` |
| Curriculum | `{ }` `</>` `{ }` |
| Mentors | `</>` `class()` `=>` |
| Schools | `<school />` `</>` `class()` |
| FAQ | `?` `// faq` `{ }` `</>` `?` |

Even-numbered tokens lift 13px so the band reads as scattered rather than a row,
and every third takes the accent.

**Word bands** (`.wmarq`) — `VIBE CODER`, `BUILD AI`, `SHIP IT`, in the live site's
positions, but set in the dot-matrix treatment rather than outline type.

**Terminal cards** (`.tcard`) — three small windows, tilted like stickers, sitting
inside the glyph bands so they can never overlap section content:

```
● ● ●  bash
$ ignite ai --build
   compiling ideas…
 ✓ built in 36h
```

The dimming lives on `.gband > span`, not on `.gband`. Opacity on the band would
create a group the cards could not escape, and they would be dimmed with the
glyphs. Below 760px the band wraps and the card takes `order: -1`.

### Floating code tokens

Six monospace tokens drift in the hero's negative space: `</>`, `{ }`, `=>`,
`const`, `npm run dev`, `$ _`. Two are accent red, the rest dim. This is the glyph
motif the live site already uses, rather than the collaborator cursors this
started as.

Each is configured by inline custom properties:

| Property | Meaning |
| --- | --- |
| `--x` / `--y` | position within the hero, as percentages |
| `--s` | font size |
| `--c` | colour |
| `--drift` | which of the three drift loops |
| `--dur` | loop duration |
| `--d` | entrance delay |

Durations are 5.5s–8s and deliberately unequal, so the tokens never fall into
sync and the drift never reads as a loop. Hidden below 900px — the centre column
leaves no room beside it on a phone.

The word "Buildathon" keeps its selection box, tagged `<h1>` like a devtools
element badge.

### Countdown

The hero carries one live line under the buttons: `Grand finale in 03d 22h 16m 34s
· October 8th, 2026 · Bengaluru`.

`#cd` is rewritten once a second from `2026-10-08T09:00:00+05:30`. Past the
deadline it prints `under way` and clears its interval rather than counting
negative.

### State endorsement lockup

The typed tagline that used to sit above the headline is gone; the Government of
Karnataka emblem and the words `Supported by / Government of Karnataka` sit there
instead. `assets/karnataka-emblem.png` is the source of truth; the same bytes are
inlined into `index.html` as a data URI so the page stays one self-contained file.

The emblem was lifted off its near-white plate by flood-filling inward from the
border rather than keying out every white pixel — the bird, the scroll and the
motto inside the shield are white too, and a blanket key punched holes through
them. It is quantised to 64 colours (10kB, ~14kB base64) and ships at 154x140 for
a 50px render, so it stays crisp at 3x.

`.gok` is in the bot exclusion list, so the bot steers around it.

### The bot

One sprite, in the hero only. It walks a single lane across the full width and
back, each destination drawn at random from the far end so every leg is a real
crossing rather than a shuffle on the spot.

The lane is not authored. `zonesFor` measures the hero copy, subtracts it from
the field with 16px of padding, and the widest leftover strip wins. That is
normally the band above the endorsement lockup. The bot is then sized to fit
that strip with ~20px left clear for its hop, and stands on the strip's floor,
so it tracks a consistent ground line instead of drifting vertically. Both the
lane and the bot are recomputed on resize.

Movement is a CSS transition with a per-leg `--t`, not `requestAnimationFrame`:
the compositor keeps it smooth where rAF is throttled. The hop is a keyframe for
the same reason. An earlier build animated a canvas per frame and ran at 1.2fps
in a preview pane.

### The step cards

Four cards on one row: a picture of the step above, the words for it below.

The **picture** borrows monday.com's device — a small board of rows, each with a
status chip, a second card overlapping it and running off the edge, and a cursor
on top. Their version carries the meaning in colour: green for done, purple for
in progress. This page has one hue, so the same rhythm is made from **fill** —
solid red for the live row, a tinted red for the one queued behind it, flat grey
for rows already settled. Two of the four add a segmented progress bar, the way a
monday progress column is drawn: discrete blocks rather than a continuous fill.

The **shape** is this page's, not monday's. Their cards are rounded and
soft-shadowed; nothing else here is. So the card is a `.notch` ticket stub like
the buttons and the prize panels, the board and chips are square, the spine is
2px and square, and the floating card is notched and flat with no shadow. A
notched panel drops its border and carries a filled surface instead, because a
`clip-path` cuts a 1px border into open ends at every step.

The floating card used to be pinned at `right: -26px`, which cut its label
mid-word — "Enroll", "30 sessio", "Shortlist". It sits at `-10px` now with extra
right padding: measured, every label ends 4px inside the card edge while the card
itself still runs off, so it reads as part of a larger board continuing past the
boundary.

The mock stays almost wordless — 9 to 12 short tokens per card, nearly all
one-word chips, against 14–21 words of real copy below. An earlier version put
readable prose in the mock and it beat the copy for attention.

The mock is `aria-hidden`. It is decoration, and the card's heading and paragraph
say everything it gestures at. That also keeps the contrast audit honest: the
faded mock type is deliberate, and the audit skips `aria-hidden` subtrees.

A later rebuild replaced all of this with a hairline-ruled band of display-size
numerals, and was reverted. The arguments for it are still worth keeping if it is
ever revisited: nested cards, a coloured left border on list items, and
soft-shadowed rounded rectangles standing in for content are all things a strict
craft floor refuses.

### Mentors

Built on the welcome-poster device: concentric frames stepping outward, a plate
inside them, and the portrait breaking out over the plate's top edge. The
reference draws its frames as rounded rectangles; this page owns the ticket-stub
notch, so the frames are notched and the echo is stepped — three fills, each a
shade lighter than the one behind it (`#0a0a0a`, `#0f0f0f`, `#151515`), with the
plate at `#1d1d1d → #080808` inside. On hover they lift by 4 / 7 / 10px, so the
stack parallaxes rather than sliding as one block.

The name sits on the portrait, set in Helvetica caps at +0.07em — the poster's
wide tracking, in the page's own display face — with the role in mono beneath it
and the separator in accent red. Because the name lands on a photograph it
carries its own ground: a scrim over the lower 46% of the stage, so the contrast
holds whatever portrait is dropped in. The company mark sits below the frame,
behind a hairline, as an `<img>` when `--logo` is set and a mono wordmark when
not.

**The portrait must be a cut-out with a real alpha channel**, and it must be
trimmed to its content. The breakout only works on a genuine matte, and the first
pass failed on the second point rather than the first: the PNGs carried ~70px of
transparent headroom, `background-size: contain` fitted the whole canvas, and the
head sat politely inside the plate instead of rising past it. Cropping each file
to its bounding box fixed it — the head now clears the plate by 45px.

### The logo row

Six marks on one line inside a ~230px card. Their aspect ratios run from 7.7:1
(Oracle) to 1:1 (PW), so a single shared height is not an option: it would run
the wordmarks off the edge while reducing the square marks to specks. The heights
are set per shape instead, so the six widths sum under the card. Measured at
231px: 39 + 62 + 34 + 16 + 32 + 15 = 198px of marks plus 20px of gaps.

Two layouts were tried first and discarded. A wrapping flex row gave five ragged
rows, because flex breaks wherever it runs out of room and these widths differ by
3x. A 3x2 grid was tidy but used two lines.

The logos arrived in six brand colours — Oracle red, Walmart blue and yellow,
PayPal blues, LinkedIn white, PW black — which on a page with one accent is six
brands shouting over each other. Every one is flattened to `#c9c9c9` at 0.72
opacity, lifting on hover. Two exceptions: **LinkedIn** stays two-tone because
its box is a filled shape with the "in" knocked out of it, so flattening both
gives a grey rectangle; its knockout is set to the card surface. **Physics
Wallah** shipped with no `fill` at all, defaulting to black and therefore
invisible here, and with no `width`/`height`, only a viewBox — both added.

`loading="lazy"` was removed from these. In a marquee the cards parked off to the
right sit outside the viewport indefinitely, so the lazy trigger never fires, and
when the track carries them in the logos pop. They are a few KB each.

### Order

Everything is sequenced: the endorsement lockup rises at 0.05s, headline lines reveal at 0.18s and
0.30s, body copy and buttons follow at 0.62–0.86s, the selection box draws at 1.0s,
its handles pop at 1.14s, and the cursors arrive last at 1.25–1.50s before handing off
to their drift loops. Full entrance is about 2.1s.

Cursors are hidden below 900px — the hero is too tight for them on a phone — but
the selection box stays at every width. All of it sits inside
`@media (prefers-reduced-motion: no-preference)`, so the resting state is the
default and nobody who opts out of motion sees any.

## Content

All content is taken from iaib.vercel.app: the six curriculum modules with their
real session lists, all fifteen FAQ entries (the live site shows six behind a
"View all"), the four process steps, the five rewards, and Gladden Rumao as the
only announced mentor.

Two things are still placeholders:

1. **The code sample** in `snippets` uses the Anthropic SDK as a realistic
   first-model-call example. Swap it for whatever the sessions actually teach.
2. **The floating code tokens** are decorative.

Registration buttons point at `https://iaib.vercel.app/`. Search for that URL to
repoint them.

## The type system

Three roles, applied consistently:

| Role | Treatment | Where |
| --- | --- | --- |
| Display | dot-matrix mask | `h1`, every `h2` |
| Label / UI | JetBrains Mono, uppercase, tracked | nav, buttons, step and card headings, stat captions, footer columns, meta |
| Reading | Bricolage Grotesque | lede, standfirsts, card copy, FAQ answers, curriculum sessions |

`h1` uses a 5px dot grid, `h2` 4px (3px below 680px). Nothing that has to be *read*
carries the mask or the uppercase treatment.

Two deliberate exceptions to the detector:

- `h2` leading is 1.12 rather than the 1.3 floor. That floor is a body-text rule;
  1.3 on a 50px heading reads loose.
- The partner names are mono but **not** uppercase — "Sri Siddhartha Academy of
  Higher Education" is 42 characters, and all-caps at that length stops being
  legible.

## Notched panels

`.notch` carries the stepped silhouette from the hero buttons at panel scale, on
the code block, rewards grid, process steps, curriculum and mentor cards.

These panels drop their 1px border and carry a filled surface instead. A
`clip-path` cuts a border into open ends at every step, so a bordered notched
panel reads as broken; a filled one reads as a cut shape. The surfaces sit at
`#0c0c0c`–`#111` so the silhouette is visible against the page black.

## Craft notes

A polish pass was run against the Impeccable craft floor and its mechanical
detector (28 findings → 17, all remaining ones triaged below).

Removed:

- **Eyebrow kickers above every heading.** A label above a heading is a hard ban —
  the heading carries its own weight. Facts a couple of them carried (the Explorer
  track, the session count) were folded into the standfirst rather than dropped.
- **Invented sequence numbers** on the rewards grid. Six unrelated rewards are not
  a sequence, so `01…06` was decoration. The four process steps keep their numbers:
  that sequence is real information.
- **The film-grain overlay.** `mix-blend-mode: overlay` over a black backdrop
  computes to zero, so the texture never reached the screen — it was a fixed
  full-viewport layer costing compositing for nothing.
- **The hero grid-lines background**, a recognised generated-page tell.
- **The partner marquee.** Three real partners fit on one line; the infinite scroll
  existed to justify itself, and was padding the loop with two invented entries.
  Now a static centred row of the three actual partners.
- **The giant ghosted footer wordmark**, which measured 1.1:1. Decoration that
  faint either shouts or does nothing.

Fixed:

- `--fg-dim` was `#5a5a5a` — 2.9:1 on black, under the 4.5:1 floor. Now `#808080`.
  Code line numbers were `#333` (1.5:1) and are now `#6a6a6a`.
- Stat and footer labels were 10.5px, under the 11px floor for functional text.
- Footer column labels were `h4` directly after an `h2`, skipping a level.
- The final CTA still said "Register free" / "View curriculum" while the rest of
  the page said "Register Now" / "Explore the curriculum".
- Monospace now means code, filenames, shell tokens and measurement. It was also
  carrying section labels, stat captions, footer headings and the collaborator name
  chips, which made it decoration rather than signal. Those are Bricolage now — and
  the name chips are more accurate for it, since the design tools this borrows from
  set their presence chips in a UI sans.
- Scrollbars, tabular numerals and focus rings are themed from the palette rather
  than left as browser defaults.

Accepted, not defects:

- **Gradient text** on "Buildathon" — pinned by the brief (the creativo-code
  reference). It is now the page's only gradient.
- **Helvetica as the display face** — pinned by the brief. See the Type section for
  the system-font caveat.
- **`cramped-padding` ×12 and `clipped-overflow-container` ×2** — false positives.
  Measured in the browser, every section has 31–121px between its lowest text and
  its bottom border; the detector is measuring the decorative `inset: 0` layers in
  the hero, and `overflow` containment that deliberately prevents sideways scroll.
