import nuxt from '@nuxt/eslint-plugin'
import { defineConfig, GLOB_SRC } from '@vida0905/eslint-config'

export default defineConfig({
  unocss: true,
  formatters: true,
}, {
  files: [GLOB_SRC],
  plugins: {
    nuxt,
  },
  rules: {
    'nuxt/nuxt-config-keys-order': 'error',
    'nuxt/prefer-import-meta': 'error',
  },
})
