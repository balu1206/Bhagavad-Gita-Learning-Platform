import type { Config } from 'tailwindcss';
import forms from '@tailwindcss/forms';
import typography from '@tailwindcss/typography';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        saffron: {
          50: '#FFF4E6', 100: '#FFE8CC', 200: '#FFD199', 300: '#FFB366',
          400: '#FF9C4D', 500: '#FF9933', 600: '#E67A00', 700: '#CC6600',
          800: '#B35200', 900: '#994400', 950: '#5C2900',
        },
        gold: {
          50: '#FAF5E6', 100: '#F5EBCC', 200: '#EBD799', 300: '#E0C366',
          400: '#D6AF4D', 500: '#D4AF37', 600: '#B8941F', 700: '#9C7A16',
          800: '#80600E', 900: '#644606', 950: '#3D2A04',
        },
        warm: {
          white: '#FFFFFF',
          50: '#FFF9F5', 100: '#FBF7F3', 200: '#F2EBE3', 300: '#E5D9CB',
          400: '#C9B89D', 500: '#9D8B72', 600: '#7A6B56', 700: '#5C5042',
          800: '#3D362D', 900: '#1F1B17', 950: '#0F0D0B',
        },
        dark: {
          50: '#F5F5F5', 100: '#E0E0E0', 200: '#CCCCCC', 300: '#B3B3B3',
          400: '#999999', 500: '#666666', 600: '#4D4D4D', 700: '#333333',
          800: '#242424', 850: '#1A1A1A', 900: '#0F0F0F', 950: '#080808',
        },
        spiritual: {
          blue: '#1E3A8A', 'blue-light': '#3B82F6',
          purple: '#7C3AED', 'purple-dark': '#6D28D9',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-playfair)', 'Georgia', 'serif'],
        sanskrit: ['var(--font-devanagari)', 'serif'],
        mono: ['var(--font-jetbrains)', 'monospace'],
      },
      boxShadow: {
        soft: '0 2px 8px rgba(0,0,0,0.04)',
        medium: '0 4px 16px rgba(0,0,0,0.08)',
        large: '0 8px 32px rgba(0,0,0,0.12)',
        xl: '0 12px 48px rgba(0,0,0,0.16)',
        glow: '0 0 20px rgba(255,153,51,0.3)',
        'glow-lg': '0 0 40px rgba(255,153,51,0.4)',
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #FF9933 0%, #D4AF37 100%)',
        'gradient-secondary': 'linear-gradient(135deg, #FFF4E6 0%, #FAF5E6 100%)',
        'gradient-spiritual': 'linear-gradient(135deg, #1E3A8A 0%, #7C3AED 100%)',
      },
      animation: {
        'fade-in': 'fadeIn 0.25s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
        'spin-slow': 'spin 3s linear infinite',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp: { '0%': { transform: 'translateY(20px)', opacity: '0' }, '100%': { transform: 'translateY(0)', opacity: '1' } },
        scaleIn: { '0%': { transform: 'scale(0.95)', opacity: '0' }, '100%': { transform: 'scale(1)', opacity: '1' } },
        pulseSoft: { '0%, 100%': { opacity: '1' }, '50%': { opacity: '0.6' } },
      },
    },
  },
  plugins: [forms, typography],
};

export default config;
