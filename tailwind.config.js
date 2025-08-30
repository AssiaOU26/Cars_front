/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ios: {
          primary: '#007AFF',
          secondary: '#5856D6',
          success: '#34C759',
          warning: '#FF9500',
          error: '#FF3B30',
          orange: '#FF6B35',
          'orange-light': '#FF8A65',
        },
        theme: {
          'bg-primary': 'var(--bg-primary)',
          'bg-secondary': 'var(--bg-secondary)',
          'bg-elevated': 'var(--bg-elevated)',
          'border-color': 'var(--border-color)',
          'text-primary': 'var(--text-primary)',
          'text-secondary': 'var(--text-secondary)',
          'text-tertiary': 'var(--text-tertiary)',
        }
      },
      fontFamily: {
        ios: ['SF Pro Display', 'Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.6s ease',
        'slide-in-right': 'slideInRight 0.6s ease',
        'scale-in': 'scaleIn 0.6s ease',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      boxShadow: {
        'ios': '0 4px 20px rgba(0, 0, 0, 0.1)',
        'ios-lg': '0 8px 30px rgba(0, 0, 0, 0.15)',
      },
      borderRadius: {
        'ios': '16px',
        'ios-lg': '20px',
      },
    },
  },
  plugins: [],
}