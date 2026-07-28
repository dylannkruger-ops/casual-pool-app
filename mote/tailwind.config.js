/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Mote's body — the dark shell from the avatar.
        shell: { DEFAULT: '#3a3d42', deep: '#2a2c30', ink: '#16181b' },
        // The face ring / eyes. The single accent in the whole product.
        glow: { DEFAULT: '#2fd463', soft: '#8df0ac', dim: '#1f9e49' },
        // Warm neutral canvas.
        canvas: { DEFAULT: '#faf9f7', sunk: '#f2f0ec' },
        // Boss/owner motif.
        crown: { DEFAULT: '#d4a72c', soft: '#f5e4b0' },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
      },
      borderRadius: { xl2: '1.25rem' },
      boxShadow: {
        card: '0 1px 2px rgba(22,24,27,.04), 0 8px 24px -12px rgba(22,24,27,.12)',
        widget: '0 18px 48px -12px rgba(22,24,27,.45)',
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
