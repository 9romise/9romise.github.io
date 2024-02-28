// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    '@vueuse/nuxt',
    '@unocss/nuxt',
    '@nuxt/eslint',
  ],
  css: ['@unocss/reset/tailwind.css', '~/assets/css/main.css'],
  vue: {
    propsDestructure: true,
  },
  eslint: {
    config: {
      standalone: false,
    },
  },
})
