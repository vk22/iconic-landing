<template>
  <footer class="border-t flex flex-col md:flex-row justify-between items-center p-4 md:p-10 border-t-1">
    <div class="left basis-1/3 mb-5 md:mb-0">
      <ul class="text-center md:text-start">
        <li><nuxt-link to="/privacy-policy" class="text-xs underline">Privacy policy</nuxt-link></li>
        <li><nuxt-link to="/terms-and-conditions" class="text-xs underline">Terms and conditions</nuxt-link></li>
        <li><nuxt-link to="/cookie-usage" class="text-xs underline">Cookie Usage Agreement</nuxt-link></li>
      </ul>
      
    </div>
    <div class="center basis-1/3 flex flex-col justify-between items-center">
      <div class="logo mb-5">
          <img class="w-[6rem]" src="../assets/img/mered.svg" alt="" />
      </div>
      <p class="text-[.75rem]">Copyright © 2025 Mered Residences Real Estate LLC</p>
    </div>
    <div class="right basis-1/3">

    </div>

  </footer>
</template>

<script setup lang="ts">

</script>

<style scoped>

</style>
