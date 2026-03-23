import { defineConfig, presetIcons, presetUno, transformerDirectives } from 'unocss'

export default defineConfig({
  theme: {
    colors: {
      gray: {
        100: '#e5e5e5',
        200: '#cbcbcb',
        300: '#a3a3a3',
        400: '#737373',
        500: '#525252',
        600: '#3d3d3d',
        700: '#262626',
        800: '#171717',
        900: '#0a0a0a',
      },
    },
  },
  shortcuts: {
    'btn': 'px-4 py-1 rounded-md inline-block cursor-pointer disabled:cursor-default disabled:bg-gray-600 disabled:op-50',
    'color-primary': 'text-gray-900 dark:text-gray-100',
    'color-secondary': 'text-gray-500 dark:text-gray-400',
    'color-content': 'text-gray-600 dark:text-gray-300',
  },
  presets: [
    presetUno(),
    presetIcons({
      extraProperties: {
        'display': 'inline-block',
        'height': '1.25em',
        'width': '1.25em',
        'vertical-align': 'text-bottom',
      },
    }),
  ],
  transformers: [
    transformerDirectives(),
  ],
})
