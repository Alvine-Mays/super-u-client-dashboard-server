import type { Config } from 'tailwindcss'

export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      borderRadius: {
        lg: '.5625rem',
        md: '.375rem',
        sm: '.1875rem',
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
      }
    },
  },
  plugins: [
    require('tailwindcss-animate'),
    require('@tailwindcss/typography')
  ],
} satisfies Config
