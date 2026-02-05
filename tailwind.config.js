/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        slalom: {
          blue: '#2852B6',
          cyan: '#00BCDB',
          teal: '#00767A',
          dark: '#011621',
        },
        cyan: {
          500: '#00BCDB',
          600: '#00767A',
          700: '#005A5E',
        },
        gray: {
          300: '#D3D3D3',
          600: '#666666',
        },
      },
      fontFamily: {
        slalom: ['Slalom Sans', 'system-ui', '-apple-system', 'sans-serif'],
      },
      fontSize: {
        48: '48px',
        32: '32px',
        24: '24px',
        18: '18px',
        16: '16px',
        14: '14px',
        12: '12px',
      },
      spacing: {
        4: '4px',
        8: '8px',
        10: '10px',
        12: '12px',
        16: '16px',
        19: '19px',
        24: '24px',
        32: '32px',
        40: '40px',
        46: '46px',
        60: '60px',
        64: '64px',
      },
      borderRadius: {
        16: '16px',
        8: '8px',
      },
      boxShadow: {
        card: '0 8px 8px rgba(0, 0, 0, 0.1)',
      },
    },
  },
  plugins: [],
};

