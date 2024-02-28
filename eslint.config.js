// @ts-check
import vida from '@vida0905/eslint-config'
import nuxt from './.nuxt/eslint.config.mjs'

export default nuxt()
  .prepend(
    vida({
      unocss: true,
    }),
  )
