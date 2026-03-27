/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50:  '#f0f4ff',
          100: '#e0e9ff',
          200: '#c7d7fe',
          300: '#a5b8fc',
          400: '#818cf8',
          500: '#667eea',
          600: '#5a67d8',
          700: '#4c51bf',
          800: '#434190',
          900: '#3c366b',
        },
        accent: {
          50:  '#fdf4ff',
          100: '#fae8ff',
          200: '#f5d0fe',
          300: '#f0abfc',
          400: '#e879f9',
          500: '#d946ef',
          600: '#c026d3',
          700: '#a21caf',
          800: '#86198f',
          900: '#701a75',
        },
        dark: {
          bg:            '#1a1b23',
          surface:       '#242530',
          border:        '#2d2e3a',
          text:          '#e4e4e7',
          textSecondary: '#a1a1aa',
        },
      },
      keyframes: {
        fadeIn: {
          '0%':   { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          '0%':   { opacity: '0', transform: 'translateX(-30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        scaleIn: {
          '0%':   { opacity: '0', transform: 'scale(0.88)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(99,102,241,0.25)' },
          '50%':      { boxShadow: '0 0 36px rgba(99,102,241,0.55)' },
        },
        pulseRing: {
          '0%':   { transform: 'scale(0.8)', opacity: '1' },
          '100%': { transform: 'scale(2)', opacity: '0' },
        },
        gradientFlow: {
          '0%':   { backgroundPosition: '0% 50%' },
          '50%':  { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        slideDown: {
          '0%':   { opacity: '0', transform: 'translateY(-12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        bounceIn: {
          '0%':   { opacity: '0', transform: 'scale(0.3)' },
          '50%':  { opacity: '1', transform: 'scale(1.05)' },
          '70%':  { transform: 'scale(0.9)' },
          '100%': { transform: 'scale(1)' },
        },
      },
      animation: {
        'fade-in':      'fadeIn 0.45s ease-out',
        'slide-in':     'slideIn 0.5s ease-out',
        'scale-in':     'scaleIn 0.35s ease-out',
        'slide-down':   'slideDown 0.3s ease-out',
        'bounce-in':    'bounceIn 0.6s cubic-bezier(.36,.07,.19,.97)',
        'shimmer':      'shimmer 3s linear infinite',
        'float':        'float 3s ease-in-out infinite',
        'glow':         'glow 2.5s ease-in-out infinite',
        'pulse-ring':   'pulseRing 1.5s ease-out infinite',
        'gradient':     'gradientFlow 4s ease infinite',
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'gradient-accent':  'linear-gradient(135deg, #f093fb 0%, #4facfe 100%)',
        'gradient-hero':    'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
        'gradient-vibrant': 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 50%, #ec4899 100%)',
      },
      boxShadow: {
        'glow-blue':   '0 0 24px rgba(59,130,246,0.4)',
        'glow-purple': '0 0 24px rgba(139,92,246,0.4)',
        'card':        '0 4px 24px -4px rgba(0,0,0,0.08)',
        'card-hover':  '0 12px 40px -8px rgba(0,0,0,0.15)',
        '3xl':         '0 35px 60px -15px rgba(0,0,0,0.3)',
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
    },
  },
  plugins: [],
}
