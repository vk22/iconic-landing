<template>
  <div class="@container">
    <div v-html="noscript" />
    <NuxtPage />
  </div>
</template>

<script setup>
const noscript = `
<!-- Google Tag Manager (noscript) -->
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-T49NR3BV"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
<!-- End Google Tag Manager (noscript) -->
`;
</script>


