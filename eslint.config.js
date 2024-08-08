// @ts-check
import { defineConfig } from '@vida0905/eslint-config'
import nuxt from './.nuxt/eslint.config.mjs'

export default nuxt()
  .prepend(
    defineConfig({
      unocss: true,
      formatters: true,
    }),
  )
