import { defineConfig } from '@vida0905/eslint-config'

export default defineConfig({
  unocss: true,
  formatters: true,
}).override('antfu/markdown/processor', {
  ignores: ['content/**/*.md'],
})
