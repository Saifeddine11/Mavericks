import { brandColors } from './src/config/brand.js';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // OffMarket brand
        'stone-brand': brandColors.stone,
        'deep-red': brandColors.deepRed,
        'dark-red': brandColors.darkRed,
        'grey-orange': brandColors.greyOrange,
        champagne: brandColors.champagne,
        'champagne-light': brandColors.champagneLight,
        graphite: brandColors.graphite,

        // Legacy aliases — map to brand for existing utilities
        ivory: brandColors.stone,
        sand: brandColors.greyOrange,
        limestone: brandColors.greyOrange,
        navy: brandColors.darkRed,
        gold: brandColors.champagne,
        ink: brandColors.darkRed,
        'ink-soft': brandColors.graphite,
        'ink-muted': '#8A7E7A',
        surface: brandColors.stone,
        'surface-warm': brandColors.greyOrange,
        white: brandColors.white,
        stone: '#8A7E7A',
        background: brandColors.darkRed,
      },

      fontFamily: {
        label: ['"Tenor Sans"', 'system-ui', 'sans-serif'],
        editorial: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        body: ['Questrial', 'system-ui', 'sans-serif'],
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['Questrial', 'system-ui', 'sans-serif'],
      },

      fontSize: {
        'display-xl': ['clamp(2.75rem, 7vw, 6.5rem)', { lineHeight: '1.02', letterSpacing: '-0.02em' }],
        'display-lg': ['clamp(2.25rem, 5vw, 4.75rem)', { lineHeight: '1.05', letterSpacing: '-0.018em' }],
        'display-md': ['clamp(1.75rem, 3.5vw, 3rem)', { lineHeight: '1.08', letterSpacing: '-0.015em' }],
        eyebrow: ['0.6875rem', { lineHeight: '1', letterSpacing: '0.22em' }],
      },

      letterSpacing: {
        widest: '0.22em',
      },

      spacing: {
        section: 'clamp(4.5rem, 10vh, 8rem)',
        'section-lg': 'clamp(6rem, 14vh, 12rem)',
      },

      maxWidth: {
        prose: '38rem',
        editorial: '72rem',
        wide: '90rem',
      },

      borderRadius: {
        subtle: '2px',
      },

      boxShadow: {
        soft: '0 1px 2px rgba(39, 7, 7, 0.04), 0 8px 24px rgba(39, 7, 7, 0.06)',
        editorial: '0 12px 48px -16px rgba(39, 7, 7, 0.14)',
      },

      transitionTimingFunction: {
        editorial: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },

      transitionDuration: {
        400: '400ms',
        600: '600ms',
        900: '900ms',
        1200: '1200ms',
      },

      animation: {
        'fade-in': 'fadeIn 0.9s cubic-bezier(0.22, 1, 0.36, 1) forwards',
        'scroll-line': 'scrollLine 2.8s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        scrollLine: {
          '0%, 100%': { transform: 'scaleY(0.35)', opacity: '0.45' },
          '50%': { transform: 'scaleY(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};
