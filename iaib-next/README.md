# IAIB — Next.js + Tailwind

The Ignite AI Buildathon landing page, ported from the single-file static build
in the parent directory. That file remains as the reference implementation.

```bash
npm install
npm run dev     # http://localhost:3000
npm run build
```

## Layout

```
app/
  layout.tsx    fonts, metadata, <html>
  page.tsx      composes the sections; mostly a server component
  globals.css   tokens (@theme) + the devices Tailwind cannot express
components/
  ui.tsx        Wrap/Sec/H2/Sub/buttons — shared primitives
  Nav, Hero, PixelBot, Lightbox, CodeTabs, Curriculum, Steps, Mentors, Faq, Footer
lib/
  data.ts       every string on the page
  snippets.ts   the four code samples, raw + highlighted
public/assets/  emblem, mentor portrait, six logos
```

## Decisions worth knowing

**Tailwind v4, CSS-first.** Tokens live in `@theme` in `globals.css`, so
`--color-accent` generates `text-accent`, `bg-accent`, `border-accent`. There is
no `tailwind.config.js`.

**Not everything is a utility.** The notch clip-path, the seamless marquee, the
layered video masks, the mentor echo frames and the bot's thought cloud stay as
plain CSS classes. Expressing a six-stop `clip-path: polygon()` or a
`mask-composite: intersect` pair in arbitrary-value utilities produces strings
nobody can read or change. Tailwind carries the layout, spacing, type and colour;
these carry the devices.

**Server by default.** Only `Nav`, `Hero`, `PixelBot`, `Lightbox`, `CodeTabs` and
`Curriculum` are client components — the parts with state, effects or the
YouTube API. `Steps`, `Mentors`, `Faq` and `Footer` render on the server.

**Fonts are self-hosted** via `next/font/google`, which emits the `@font-face`
rules at build time: no render-blocking request to Google and no layout shift
from a late swap. Helvetica stays a system face; it is the `h1` voice and is not
downloaded.

**The gutter is a token** (`--gut`, 120px stepping down to 20px). The hero
video's full-bleed margin is derived from it rather than repeating the number.

**Carried over from the static build**, with the reasoning intact in comments:
the marquee uses a trailing margin rather than `gap`, because with `gap` a track
of N cards has N−1 gaps and `-50%` lands half a gap short; the hero clip uses
`mix-blend-mode: screen` so its blacks go transparent; the logos have no
`loading="lazy"` because in a marquee the off-screen cards never trigger it.

## Still placeholder

The mentor names, roles and logos are invented, and one supplied portrait fills
every card — nobody named there is the person pictured. Register has no
destination yet and is a `<button>` with no handler rather than a link to
nowhere. See `lib/data.ts`.
