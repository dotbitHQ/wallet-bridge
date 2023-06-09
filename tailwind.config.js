/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'main-color': '#374151',
      },
      keyframes: {
        bgFadeIn: {
          from: { background: 'transparent' },
          to: { background: 'rgba(27, 29, 33, 0.7)' },
        },
        bgFadeOut: {
          from: { background: 'rgba(27, 29, 33, 0.7)' },
          to: { background: 'transparent' },
        },
        fadeInDown: {
          from: {
            opacity: '0',
            transform: 'translate3d(0, -20px, 0)',
          },
          to: {
            opacity: '1',
            transform: 'translate3d(0, 0, 0)',
          },
        },
        fadeOutUp: {
          from: { opacity: '1' },
          to: {
            opacity: '0',
            transform: 'translate3d(0, -20px, 0)',
          },
        },
      },
      animation: {
        bgFadeIn: 'bgFadeIn 0.2s ease forwards',
        bgFadeOut: 'bgFadeOut 0.2s linear forwards',
        fadeInDown: 'fadeInDown 0.2s ease forwards',
        fadeOutUp: 'fadeOutUp 0.2s linear forwards',
      },
    },
  },
  plugins: [],
}
