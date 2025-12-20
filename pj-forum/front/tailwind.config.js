/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'voz-blue': '#0066cc',
        'voz-bg': '#f5f5f5',
        'voz-border': '#e0e0e0',
        'voz-text': '#333333',
        'voz-gray': '#666666',
        'voz-hover': '#f0f7ff',
        'voz-pinned': '#fff8e1',
      },
    },
  },
  plugins: [],
}
