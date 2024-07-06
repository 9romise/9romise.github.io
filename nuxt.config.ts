// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ['@vueuse/nuxt', '@unocss/nuxt', '@nuxt/eslint', '@nuxt/content'],
  css: ['@unocss/reset/tailwind.css', '~/assets/css/main.scss'],
  vue: {
    propsDestructure: true,
  },

  eslint: {
    config: {
      standalone: false,
    },
  },
  compatibilityDate: '2024-07-07',
})
