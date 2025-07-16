import { defineConfig, presetIcons, presetUno, transformerDirectives } from 'unocss'

export default defineConfig({
  theme: {
    colors: {
      gray: {
        100: '#f5f5f5',
        200: '#e5e5e5',
        300: '#d4d4d4',
        400: '#a3a3a3',
        500: '#737373',
        600: '#525252',
        700: '#3d3d3d',
        800: '#262626',
        900: '#171717',
      },
    },
  },
  shortcuts: {
    'btn': 'px-4 py-1 rounded inline-block cursor-pointer disabled:cursor-default disabled:bg-gray-600 disabled:op-50',
    'color-primary': 'color-gray-700 dark:color-gray-200',
    'color-secondary': 'color-gray-500 dark:color-gray-400',
    'color-content': 'color-gray-600 dark:color-gray-300',
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
