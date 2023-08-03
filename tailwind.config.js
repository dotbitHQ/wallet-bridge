/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        success: '#22C493',
        'success-hover': '#1EAE82',
        'success-active': '#1B9D75',
        danger: '#FF6B6B',
        'danger-hover': '#E05656',
        'secondary-5': 'rgba(82, 98, 121, 0.05)',
        secondary: 'rgba(82, 98, 121, 0.1)',
        'secondary-hover': 'rgba(82, 98, 121, 0.2)',
        'secondary-active': 'rgba(82, 98, 121, 0.25)',
        'font-primary': '#121314',
        'font-secondary': '#B0B8BF',
        'font-tips': '#31333E',
        'font-disconnect': '#9BB1C7',
        'mask-bg': 'rgba(27, 29, 33, 0.7)',
      },
      maxHeight: {
        'dialog-list-max-height': '420px',
      },
      lineHeight: {
        4.5: '18px',
      },
      boxShadow: {
        toast: '0 1px 2px 0 rgba(0, 0, 0, 0.04)',
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
}
