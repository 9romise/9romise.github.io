// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@vueuse/nuxt',
    '@unocss/nuxt',
    '@nuxt/content',
  ],
  devtools: { enabled: true },
  app: {
    head: {
      titleTemplate: '%s | Vida Xie',
    },
  },
  css: ['@unocss/reset/tailwind.css', '~/assets/css/main.css'],
  content: {
    build: {
      markdown: {
        highlight: {
          theme: {
            default: 'vitesse-light',
            dark: 'vitesse-dark',
          },
        },
      },
    },
  },
  future: {
    compatibilityVersion: 4,
  },
  compatibilityDate: '2024-07-07',
})
