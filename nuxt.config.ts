// https://nuxt.com/docs/api/configuration/nuxt-config
//import tailwindcss from "@tailwindcss/vite";
export default defineNuxtConfig({
  app: {
    head: {
      title: 'Iconic Residences',
      description: 'Iconic Residences',
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      link: [{ rel: 'icon', type: 'image/png', href: "/favicon.png" }]
    }
  },
  modules: [
    '@nuxtjs/i18n',
    '@nuxtjs/tailwindcss'
  ],
  i18n: {
    // 🌍 Языки
    locales: [
      { code: 'en', iso: 'en-US', name: 'English', file: 'en.json' },
      { code: 'ar', iso: 'ar-AR', name: 'Arabic', file: 'ar.json' },
      { code: 'ru', iso: 'ru-RU', name: 'Russian', file: 'ru.json' }
    ],
    pages: {
      admin: false
    },
    defaultLocale: 'en',

    // 📁 Папка с переводами
    langDir: 'locales/',

    strategy: 'prefix_except_default',
    // → https://mellowresort.com/
    // → https://mellowresort.com/es/
    // → https://mellowresort.com/fr/

    lazy: true,
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'lang',
      redirectOn: 'root', // перенаправление только с /
    }
  },
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
})
