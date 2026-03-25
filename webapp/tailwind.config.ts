import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      colors: {
        'on-primary-container': '#081486',
        'on-surface': '#dae2fd',
        'inverse-surface': '#dae2fd',
        'surface-container-highest': '#2d3449',
        tertiary: '#ddb8ff',
        'surface-dim': '#0b1326',
        'surface-container': '#171f33',
        'primary-container': '#7c87f3',
        'on-secondary': '#381385',
        'surface-tint': '#bdc2ff',
        'surface-container-low': '#131b2e',
        'on-secondary-fixed': '#21005e',
        primary: '#bdc2ff',
        'inverse-primary': '#4953bc',
        'tertiary-fixed': '#f0dbff',
        'primary-fixed': '#e0e0ff',
        'surface-container-lowest': '#060e20',
        'on-surface-variant': '#c7c4d7',
        'on-tertiary-container': '#400071',
        'surface-bright': '#31394d',
        secondary: '#cebdff',
        'on-tertiary-fixed': '#2c0051',
        'secondary-container': '#4f319c',
        'outline-variant': '#464554',
        'on-primary-fixed': '#000767',
        'secondary-fixed-dim': '#cebdff',
        'surface-container-high': '#222a3d',
        background: '#0b1326',
        'on-error': '#690005',
        'inverse-on-surface': '#283044',
        outline: '#908fa0',
        'secondary-fixed': '#e8ddff',
        'tertiary-fixed-dim': '#ddb8ff',
        'on-secondary-container': '#bea8ff',
        surface: '#0b1326',
        'on-error-container': '#ffdad6',
        'error-container': '#93000a',
        'on-primary-fixed-variant': '#2f3aa3',
        'on-primary': '#131e8c',
        'tertiary-container': '#b175ec',
        error: '#ffb4ab',
        'on-secondary-fixed-variant': '#4f319c',
        'on-tertiary-fixed-variant': '#62259b',
        'on-tertiary': '#490081',
        'on-background': '#dae2fd',
        'surface-variant': '#2d3449',
        'primary-fixed-dim': '#bdc2ff'
      },
      fontFamily: {
        headline: ['var(--font-space-grotesk)'],
        body: ['var(--font-inter)'],
        label: ['var(--font-inter)'],
        mono: ['var(--font-jetbrains-mono)']
      },
      borderRadius: {
        DEFAULT: '0.125rem',
        lg: '0.25rem',
        xl: '0.5rem',
        full: '0.75rem'
      },
      boxShadow: {
        hero: '0 20px 40px rgba(0,0,0,0.4)'
      }
    }
  },
  plugins: []
};

export default config;
