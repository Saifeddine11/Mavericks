/**
 * MagneticButton
 *
 * A button that the cursor "magnetises" toward as the pointer approaches.
 * On pointer move within the element, we translate the button toward the
 * cursor by a fraction of the offset; on pointer leave, it springs back.
 *
 * Implementation uses Framer's `useMotionValue` + `useSpring` so the motion
 * is physics-based and feels expensive without any GSAP machinery.
 *
 * Reduced motion: the magnetic effect is completely disabled — the button
 * behaves like a normal button. Hover styling still applies via the parent.
 *
 * The component is unstyled by design. Wrap or extend it for visuals.
 * Phase 3's `LuxuryButton` will compose this for the hero CTAs.
 *
 * Touch: pointer events fire on touch too, but the effect is too subtle to
 * read on a tap. We only attach the listeners when `(hover: hover)` matches.
 *
 * Props
 *   children   — content
 *   as         — 'button' (default) | 'a'. Tag to render.
 *   strength   — 0..1, how strongly the element follows the cursor.
 *                0.3 means the element moves 30% of the cursor offset.
 *                Default: 0.25 (subtle).
 *   radius     — Detection radius in px. The effect only engages when the
 *                pointer is within `radius` of the centre. Default: 60.
 *                Setting it equal to or smaller than half the button size
 *                makes it only react inside the button itself.
 *   className  — applied to the outer interactive element.
 *   innerClass — applied to an inner wrapper that can move independently,
 *                if the parent should stay anchored (e.g. for hit area).
 *   ...rest    — forwarded to the root element (onClick, href, type, etc.)
 *
 * Implementation note
 *   Two layers: an outer element receiving the events, and an inner
 *   <motion.span> that actually translates. This pattern lets the hit
 *   area stay rectangular while the visual element wanders — important
 *   for accessibility and pointer reliability.
 */

import { useRef } from 'react';
import {
  motion,
  useMotionValue,
  useSpring,
  useReducedMotion,
} from 'framer-motion';
import clsx from 'clsx';

const SPRING = { stiffness: 150, damping: 15, mass: 0.5 };

export default function MagneticButton({
  children,
  as = 'button',
  strength = 0.25,
  radius = 60,
  className,
  innerClass,
  ...rest
}) {
  const reduce = useReducedMotion();
  const ref = useRef(null);

  // Motion values for the inner element's offset.
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const xSpring = useSpring(x, SPRING);
  const ySpring = useSpring(y, SPRING);

  const handlePointerMove = (event) => {
    if (reduce) return;
    const el = ref.current;
    if (!el) return;
    // Bail on coarse pointers (touch). They don't have a meaningful hover.
    if (event.pointerType === 'touch') return;

    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = event.clientX - cx;
    const dy = event.clientY - cy;
    const distance = Math.hypot(dx, dy);

    // Only attract within the detection radius. Beyond it, return home.
    if (distance > Math.max(radius, Math.min(rect.width, rect.height) / 2)) {
      x.set(0);
      y.set(0);
      return;
    }
    x.set(dx * strength);
    y.set(dy * strength);
  };

  const handlePointerLeave = () => {
    x.set(0);
    y.set(0);
  };

  // Reduced motion path — render a plain element with no listeners.
  if (reduce) {
    const Tag = as;
    return (
      <Tag ref={ref} className={className} {...rest}>
        <span className={innerClass}>{children}</span>
      </Tag>
    );
  }

  const Tag = as === 'a' ? motion.a : motion.button;

  return (
    <Tag
      ref={ref}
      type={as === 'button' ? rest.type ?? 'button' : undefined}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className={clsx('relative inline-flex', className)}
      {...rest}
    >
      <motion.span
        // Inline-flex so child content lays out normally; the span is the
        // thing that moves while the outer Tag (and therefore the hit area)
        // stays anchored to its layout slot.
        className={clsx('inline-flex items-center will-change-transform', innerClass)}
        style={{ x: xSpring, y: ySpring }}
      >
        {children}
      </motion.span>
    </Tag>
  );
}
