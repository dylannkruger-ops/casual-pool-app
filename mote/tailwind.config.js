/** Colours resolve through CSS variables so one attribute on <html> flips the app. */
const token = (name) => `rgb(var(--${name}) / <alpha-value>)`;

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        canvas: { DEFAULT: token('canvas'), sunk: token('sunk') },
        surface: token('surface'),
        sunk: token('sunk'),
        ink: token('ink'),
        line: token('line'),
        hover: token('hover'),
        /** Primary buttons: near-black on light, near-white on dark. */
        btn: { DEFAULT: token('btn'), ink: token('btn-ink') },
        /** The docked Mote widget — dark in both themes, but not pure black on dark. */
        widget: { DEFAULT: token('widget'), ink: token('widget-ink') },

        // Fixed brand colours: the character and the crown do not change.
        shell: { DEFAULT: '#3a3d42', deep: '#2a2c30', ink: token('ink') },
        glow: { DEFAULT: '#2fd463', soft: '#8df0ac', dim: '#1f9e49' },
        crown: { DEFAULT: '#d4a72c', soft: token('crown-soft') },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
      },
      borderRadius: { xl2: '1.25rem' },
      boxShadow: {
        card: 'var(--shadow-card)',
        widget: 'var(--shadow-widget)',
      },
      keyframes: {
        breathe: { '0%,100%': { transform: 'scale(1)' }, '50%': { transform: 'scale(1.035)' } },
        pulse2: { '0%,100%': { opacity: '1' }, '50%': { opacity: '.45' } },
        sweep: { '0%': { transform: 'translateX(-110%)' }, '100%': { transform: 'translateX(110%)' } },
        bloom: { '0%': { transform: 'scale(.9)', opacity: '.4' }, '100%': { transform: 'scale(1)', opacity: '1' } },
      },
      animation: {
        breathe: 'breathe 4.5s ease-in-out infinite',
        pulse2: 'pulse2 .9s ease-in-out infinite',
        sweep: 'sweep 1.6s ease-in-out infinite',
        bloom: 'bloom .5s ease-out',
      },
    },
  },
  plugins: [],
};
