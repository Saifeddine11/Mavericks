/** Chapter opacity curves — brief holds, early fade-outs, no frozen end title. */
export const CHAPTER_KEYFRAMES = [
  [
    { t: 0, op: 0 },
    { t: 0.04, op: 1 },
    { t: 0.09, op: 1 },
    { t: 0.17, op: 0 },
  ],
  [
    { t: 0.13, op: 0 },
    { t: 0.19, op: 1 },
    { t: 0.26, op: 1 },
    { t: 0.34, op: 0 },
  ],
  [
    { t: 0.3, op: 0 },
    { t: 0.36, op: 1 },
    { t: 0.43, op: 1 },
    { t: 0.51, op: 0 },
  ],
  [
    { t: 0.47, op: 0 },
    { t: 0.53, op: 1 },
    { t: 0.6, op: 1 },
    { t: 0.7, op: 0 },
  ],
];

/**
 * Maps chapter opacity → blur / translateY (desktop).
 * Readable plateau (op ≥ 0.88): nearly sharp.
 * Mid-transition: 6–12px blur.
 * Exit (op < 0.55): up to 16px blur + upward drift.
 */
export function chapterVisualState(op) {
  const transitionBlend = 4 * op * (1 - op);

  let blurPx;
  if (op >= 0.88) {
    blurPx = (1 - op) * 8;
  } else {
    blurPx = transitionBlend * 12;
    if (op < 0.55) {
      blurPx += (0.55 - op) * 14;
    }
    blurPx = Math.min(16, blurPx);
  }

  const translateY =
    (1 - op) * 28 + transitionBlend * 6 + (op < 0.5 ? (0.5 - op) * 18 : 0);

  return { opacity: op, translateY, blurPx };
}

/** Lighter motion for mobile — opacity + transform only, capped blur. */
export function chapterVisualStateMobile(op) {
  const transitionBlend = 4 * op * (1 - op);

  let blurPx;
  if (op >= 0.88) {
    blurPx = (1 - op) * 3;
  } else {
    blurPx = transitionBlend * 4;
    if (op < 0.55) {
      blurPx += (0.55 - op) * 4;
    }
    blurPx = Math.min(6, blurPx);
  }

  const translateY =
    (1 - op) * 16 + transitionBlend * 3 + (op < 0.5 ? (0.5 - op) * 8 : 0);

  return { opacity: op, translateY, blurPx };
}

export function clampProgress(progress) {
  return Math.min(1, Math.max(0, progress));
}

export function opacityFromKeyframes(progress, keyframes) {
  if (keyframes.length === 0) return 0;
  if (progress <= keyframes[0].t) return keyframes[0].op;
  const last = keyframes[keyframes.length - 1];
  if (progress >= last.t) return last.op;

  for (let i = 0; i < keyframes.length - 1; i++) {
    const a = keyframes[i];
    const b = keyframes[i + 1];
    if (progress >= a.t && progress <= b.t) {
      const span = b.t - a.t;
      if (span <= 0) return b.op;
      const f = (progress - a.t) / span;
      return a.op + f * (b.op - a.op);
    }
  }
  return 0;
}

export function ctaOpacity(progress, revealAt, fadeSpan) {
  if (progress < revealAt) return 0;
  return Math.min(1, (progress - revealAt) / fadeSpan);
}

export function scrollHintOpacity(progress) {
  if (progress > 0.12) return 0;
  if (progress <= 0.02) return 0.65;
  return 0.65 * (1 - (progress - 0.02) / 0.1);
}

/** Midpoint of each chapter's opacity=1 hold — blur is 0, title fully readable. */
function chapterHoldCenters(keyframes) {
  const centers = [];
  for (const chapter of keyframes) {
    for (let i = 0; i < chapter.length - 1; i++) {
      const a = chapter[i];
      const b = chapter[i + 1];
      if (a.op === 1 && b.op === 1) {
        centers.push((a.t + b.t) / 2);
        break;
      }
    }
  }
  return centers;
}

/** Clean hero scroll progress values (0..1). */
export function buildHeroSnapPoints(ctaRevealAt, ctaFadeSpan) {
  const holds = chapterHoldCenters(CHAPTER_KEYFRAMES);
  const ctaFull = Math.min(1, ctaRevealAt + ctaFadeSpan);
  const points = [0, ...holds, ctaFull, 1];
  return [...new Set(points.map((p) => Math.round(p * 1000) / 1000))].sort(
    (a, b) => a - b,
  );
}

/** Shared ScrollTrigger snap tuning — premium finish, no fighting active scroll. */
export const SCROLL_TRIGGER_SNAP = {
  duration: { min: 0.35, max: 0.9 },
  delay: 0.08,
  ease: 'power2.out',
  directional: true,
};

/** Mobile hero snap — shorter settle, less sticky feel. */
export const SCROLL_TRIGGER_SNAP_MOBILE = {
  duration: { min: 0.18, max: 0.42 },
  delay: 0.04,
  ease: 'power2.out',
  directional: true,
};
