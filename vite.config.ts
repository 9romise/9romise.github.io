import MarkdownItShiki from '@shikijs/markdown-it'
import Vue from '@vitejs/plugin-vue'
import MarkdownItMagicLink from 'markdown-it-magic-link'
import UnoCSS from 'unocss/vite'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import Markdown from 'unplugin-vue-markdown/vite'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    Vue(),
    UnoCSS(),
    AutoImport({
      imports: [
        'vue',
        '@vueuse/core',
      ],
    }),
    Components(),
    Markdown({
      async markdownItSetup(md) {
        md
          .use(await MarkdownItShiki({
            themes: {
              dark: 'vitesse-dark',
              light: 'vitesse-light',
            },
          }))
          .use(MarkdownItMagicLink, {
            linksMap: {
              'ESLint Stylistic': 'https://github.com/eslint-stylistic/eslint-stylistic',
            },
          })
      },
    }),
  ],
})
