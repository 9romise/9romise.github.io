// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      titleTemplate: '%s | Vida Xie',
    },
  },
  devtools: { enabled: true },
  modules: [
    '@vueuse/nuxt',
    '@unocss/nuxt',
    '@nuxt/eslint',
    '@nuxt/content',
  ],
  css: ['@unocss/reset/tailwind.css', '~/assets/css/main.scss'],
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
  eslint: {
    config: {
      standalone: false,
    },
  },
  compatibilityDate: '2024-07-07',
})
