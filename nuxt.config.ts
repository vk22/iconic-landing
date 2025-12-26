// https://nuxt.com/docs/api/configuration/nuxt-config
//import tailwindcss from "@tailwindcss/vite";
export default defineNuxtConfig({
  app: {
    head: {
      title: 'Iconic Residences',
      description: 'Iconic Residences',
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      link: [{ rel: 'icon', type: 'image/png', href: "/favicon.png" }],
      script: [
        // CallGear basic
        {
          src: 'https://app.callgear.ae/static/cs.min.js?k=ZCCbA4llImb08pgeGeXNMfvEYXuVe2ex',
          async: true,
          type: 'text/javascript'
        },

        // CallGear custom
        {
          src: 'https://custom.callgear.com/static/67947/script.js',
          async: true,
          type: 'text/javascript'
        },
        // Google Tag Manager
        {
          hid: 'gtm-script',
          innerHTML: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-T49NR3BV');`,
          type: 'text/javascript'
        }
      ],
      __dangerouslyDisableSanitizersByTagID: {
        'gtm-script': ['innerHTML']
      }
    }
  },
  modules: [
    '@nuxtjs/i18n',
    '@nuxtjs/tailwindcss'
  ],
  i18n: {
    // 🌍 Языки
    locales: [
      { code: 'en', iso: 'en-US', name: 'English', file: 'en.json', dir: 'ltr' },
      { code: 'ru', iso: 'ru-RU', name: 'Russian', file: 'ru.json', dir: 'ltr' },
      { code: 'ar', iso: 'ar-AR', name: 'Arabic', file: 'ar.json', dir: 'rtl' }
    ],
    pages: {
      admin: false
    },
    defaultLocale: 'en',
    langDir: 'locales/',
    strategy: 'prefix_except_default',
    // → https://site.com/
    // → https://site.com/ru/
    // → https://site.com/ar/

    lazy: true,
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'lang',
      redirectOn: 'root',
    }
  },
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
})
