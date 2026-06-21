# Mavericks — Hero Video

This directory holds the cinematic hero footage. The `HeroCinematic` section
in `src/sections/HeroCinematic.jsx` references these files by exact path —
replacing the placeholder is a one-file swap.

## Current placeholder

| File | Size | Purpose |
|------|------|---------|
| `hero-placeholder.mp4` | ~106 KB | A 12-second seamless ivory→sand gradient loop. Will read as cinematic atmosphere even before real footage is dropped in. |
| `hero-poster.svg` | ~1.5 KB | The static poster image shown before the video starts playing and as a fallback if the browser refuses autoplay. |

## What to ship for production

Replace `hero-placeholder.mp4` with a real Marrakech luxury film at the same
filename, OR drop a new file and update the path in `HeroCinematic.jsx`.

### Recommended specs

| Property | Value |
|----------|-------|
| Container | MP4 (H.264) — ship a `.webm` alongside for ~30% smaller payload on supporting browsers |
| Resolution | 1920×1080 (full HD). 4K is overkill — autoplay video at 4K hurts mobile data |
| Frame rate | 24 fps (cinematic) |
| Bitrate | 2–4 Mbps for HD |
| Duration | 12–20 seconds, looped seamlessly (last frame must match first) |
| Audio | None — the video is muted and must remain so for autoplay to work |
| Color | Bright, warm. Late afternoon Marrakech light. Avoid harsh shadows |
| Subject | Villa courtyard with water, palm shadows on stone, slow pan across architecture, or a static plate with subtle motion (palm fronds moving, water rippling) |

### Scroll-scrubbed homepage hero

`ScrollVideoHero` (`src/components/sections/ScrollVideoHero.tsx`) drives playback
from scroll position — no autoplay. Drop your villa film here:

| File | Purpose |
|------|---------|
| `villa-scroll.mp4` | Full scroll-scrub timeline (H.264, ~24fps, muted, no audio) |

Recommended: 1920×1080, 2–4 Mbps, 15–45s of continuous motion (slow pans,
detail shots) so scrubbing feels cinematic rather than jumpy.

### Filename convention

```
public/videos/
├── villa-scroll.mp4    (scroll-scrub hero — ScrollVideoHero)
├── hero.mp4              (1920×1080 H.264, primary source)
├── hero.webm             (1920×1080 VP9, optional but recommended)
├── hero-mobile.mp4       (1280×720 H.264, optional, served via <source media>)
└── hero-poster.jpg       (1920×1080 still, replaces the SVG poster)
```

If you ship a mobile variant, update `HeroCinematic.jsx` to add a
`<source media="(max-width: 767px)" src="/videos/hero-mobile.mp4">` element.

### Autoplay constraints (browser policy)

For autoplay to work on every browser:
- The `<video>` MUST have `muted` and `playsinline` set. Both are already in
  the markup.
- iOS Safari additionally requires `playsinline` on the element (already set)
  AND a user-initiated trigger if `prefers-reduced-data` is set.

### Reduced-motion behaviour

When `prefers-reduced-motion: reduce` matches, the video element is replaced
at runtime by the poster image. The user sees a still frame, not a film loop.
This is enforced in `HeroCinematic.jsx`, not at the video layer, so the same
file ships to everyone.
