/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ["class"],
    content: [
    "./index.html",
    "./src/**/*.{ts,tsx,js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#3B2E7E',
          foreground: '#FFFFFF',
        },
        secondary: {
          DEFAULT: '#6C4FD6',
          foreground: '#FFFFFF',
        },
        accent: {
          DEFAULT: '#26D6C9',
          foreground: '#1A1730',
        },
        background: '#F7F5FD',
        surface: '#FFFFFF',
        confidence: {
          high: '#1E8E5A',
          medium: '#B8860B',
          low: '#C0392B',
        },
        citation: {
          bg: '#EDE9FA',
          text: '#6C4FD6',
        },
        text: {
          primary: '#1A1730',
          secondary: '#635E7A',
          ondark: '#F7F5FD',
        },
        border: '#E4E0F5',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['IBM Plex Mono', 'monospace'],
      },
      borderRadius: {
        lg: '10px',
        md: '8px',
        sm: '6px',
      }
    },
  },
  plugins: [require("tailwindcss-animate")],
}
