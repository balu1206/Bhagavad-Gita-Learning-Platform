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
    screens: {
      xs: '400px', sm: '640px', md: '768px', lg: '1024px', xl: '1280px', '2xl': '1536px',
    },
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
        cream: {
          50: '#FDFBF7', 100: '#FAF6EE', 200: '#F5EDD9', 300: '#EDE0C2',
          400: '#DFD0A6', 500: '#C9B98A', 600: '#A99468', 700: '#85714A',
          800: '#5E4F35', 900: '#3A3020', 950: '#1C170E',
        },
        warm: {
          white: '#FDFBF7',
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
        sans:     ['var(--font-sans)',    'system-ui', 'sans-serif'],
        display:  ['var(--font-display)', 'Georgia',   'serif'],
        serif:    ['var(--font-display)', 'Georgia',   'serif'],
        sanskrit: ['var(--font-sanskrit)','serif'],
        mono:     ['ui-monospace',        'monospace'],
      },
      fontSize: {
        '8xl':  ['6rem',  { lineHeight: '1', letterSpacing: '-0.04em' }],
        '9xl':  ['8rem',  { lineHeight: '1', letterSpacing: '-0.05em' }],
        '10xl': ['10rem', { lineHeight: '1', letterSpacing: '-0.05em' }],
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      boxShadow: {
        soft:         '0 2px 8px rgba(180,100,0,0.06)',
        medium:       '0 4px 20px rgba(180,100,0,0.10)',
        large:        '0 8px 40px rgba(180,100,0,0.14)',
        xl:           '0 16px 60px rgba(180,100,0,0.18)',
        glow:         '0 0 24px rgba(255,153,51,0.35)',
        'glow-lg':    '0 0 48px rgba(255,153,51,0.45)',
        inner:        'inset 0 1px 1px rgba(255,255,255,0.18)',
        'inner-dark': 'inset 0 1px 1px rgba(0,0,0,0.12)',
      },
      backgroundImage: {
        'gradient-primary':        'linear-gradient(135deg, #FF9933 0%, #D4AF37 100%)',
        'gradient-saffron-glow':   'radial-gradient(ellipse at center, rgba(255,153,51,0.25) 0%, transparent 70%)',
        'gradient-warm-radial':    'radial-gradient(ellipse at 50% 0%, rgba(255,153,51,0.12) 0%, transparent 60%)',
        'gradient-text':           'linear-gradient(135deg, #FF9933 0%, #D4AF37 60%, #FF9933 100%)',
      },
      transitionTimingFunction: {
        spring:    'cubic-bezier(0.32, 0.72, 0, 1)',
        'expo-out':'cubic-bezier(0.16, 1, 0.3, 1)',
        'back-out':'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      transitionDuration: {
        '400': '400ms',
        '600': '600ms',
        '800': '800ms',
      },
      animation: {
        'blur-in':  'blurIn 0.6s cubic-bezier(0.16,1,0.3,1) forwards',
        'float':    'float 6s ease-in-out infinite',
        'grain':    'grain 0.5s steps(1) infinite',
        'slide-up': 'slideUp 0.4s cubic-bezier(0.32,0.72,0,1) forwards',
        'fade-in':  'fadeIn 0.4s ease forwards',
      },
      keyframes: {
        blurIn: {
          '0%':   { opacity: '0', filter: 'blur(8px)', transform: 'translateY(8px)' },
          '100%': { opacity: '1', filter: 'blur(0)',   transform: 'translateY(0)' },
        },
        float: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%':     { transform: 'translateY(-8px)' },
        },
        grain: {
          '0%,100%': { transform: 'translate(0,0)' },
          '10%':     { transform: 'translate(-2%,-3%)' },
          '30%':     { transform: 'translate(3%,-1%)' },
          '50%':     { transform: 'translate(-1%, 2%)' },
          '70%':     { transform: 'translate(2%, 3%)' },
          '90%':     { transform: 'translate(-3%, 1%)' },
        },
        slideUp: {
          '0%':   { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [forms, typography],
};

export default config;
