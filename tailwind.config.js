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
        'loggedin-button': '0px 4px 6px 0px rgba(168, 168, 168, 0.05)',
        passkey: '0px 4px 10px 0px rgba(83, 171, 255, 0.10), 0px 16px 24px 0px rgba(54, 120, 182, 0.10);',
      },
      backgroundImage: {
        passkey: 'linear-gradient(90deg, #00DF9B 0%, #0E7DFF 100%)',
      },
      flex: {
        'loggedin-button': '1 1 calc(50% - 6px)',
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
}
