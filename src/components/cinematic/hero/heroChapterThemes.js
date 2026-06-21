import { CHAPTER_KEYFRAMES, opacityFromKeyframes } from './heroV2ScrollMath';

/** Local veils — premium, text-area only (not full-screen blackout). */
export const HERO_VEILS = {
  darkVeil:
    'radial-gradient(ellipse 85% 75% at 50% 48%, rgba(39,7,7,0.52) 0%, rgba(39,7,7,0.22) 42%, transparent 72%)',
  softLightVeil:
    'radial-gradient(ellipse 90% 80% at 50% 48%, rgba(241,235,235,0.38) 0%, rgba(102,8,16,0.18) 38%, transparent 70%)',
};

export const HERO_THEME_CLASSES = {
  lightText: 'hero-v2-theme-lightText',
  darkText: 'hero-v2-theme-darkText',
};

/** Chapter with highest opacity at progress — drives veil + stage theme. */
export function getDominantChapterIndex(progress, keyframes = CHAPTER_KEYFRAMES) {
  let bestIndex = 0;
  let bestOpacity = -1;

  for (let i = 0; i < keyframes.length; i++) {
    const op = opacityFromKeyframes(progress, keyframes[i]);
    if (op > bestOpacity) {
      bestOpacity = op;
      bestIndex = i;
    }
  }

  return bestIndex;
}

export function resolveChapterTheme(chapter) {
  const theme = chapter?.theme ?? 'lightText';
  const veil = chapter?.veil ?? (theme === 'darkText' ? 'softLightVeil' : 'darkVeil');
  return { theme, veil };
}
