/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Wiejska Świeżość Palette
        'bg-main': '#FFF8DC', // Cornsilk - Very light, warm beige/cream
        'bg-card': '#F5F5DC', // Beige - Slightly darker for cards
        'nav-bg': '#6B8E23', // Olive Drab - Muted green for nav
        'accent-primary': '#FFA500', // Orange - Sunny accent
        'accent-secondary': '#FFD700', // Gold - Secondary accent (e.g., progress)
        'text-color': '#4A3B33', // Dark Brown - Main text and elements
        'ai-bg': '#E8F5E9', // Light Green - AI panel background
      }
    },
  },
  plugins: [],
}