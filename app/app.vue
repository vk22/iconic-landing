<template>
  <div class="@container" :lang="routeLocale" :dir="isRtl ? 'rtl' : 'ltr'">
    <div v-html="noscript" :class="{ rtl: isRtl }" />
    <NuxtPage />
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router'

const route = useRoute()

const routeLocale = computed(() => {
  const seg = route.path.split('/')[1]
  return ['ru', 'ar'].includes(seg) ? seg : 'en'
})
const isRtl = computed(() => routeLocale.value === 'ar');

const noscript = `
<!-- Google Tag Manager (noscript) -->
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-T49NR3BV"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
<!-- End Google Tag Manager (noscript) -->
`;
</script>


