<template>
  <footer class="footer flex flex-row justify-between items-center p-10 border-t-1">
    <div class="left basis-1/3">
      <ul>
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
footer {
  border-top: 1px solid #ddd;
}
</style>
