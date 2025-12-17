<template>
  <div class="@container" :lang="locale" :dir="locale === 'ar' ? 'rtl' : 'ltr'">
    <div v-html="noscript" />
    <NuxtPage />
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
const { locale } = useI18n()

const noscript = `
<!-- Google Tag Manager (noscript) -->
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-MB7PVQ98"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
<!-- End Google Tag Manager (noscript) -->
`;
</script>


