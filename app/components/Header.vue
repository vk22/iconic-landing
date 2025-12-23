<template>
  <header
    class="header flex items-center justify-between px-4 md:px-6 py-2 md:py-4 transition-all duration-1000"
    :class="{
      'opacity-100 translate-y-0': contentVisible,
      'opacity-0 -translate-y-4': !contentVisible,
    }"
  >
    <!-- left -->
    <nav class="hidden md:flex md:w-[25rem]">
      <div class="flex">
        <nuxt-link
          v-for="(item, index) in menu"
          :key="index"
          :to="{ hash: item.id }"
          :external="true"
          class="mr-5 text-white text-[.7rem] uppercase tracking-[1.25px]"
        >
          {{ item.text }}
        </nuxt-link>
      </div>
    </nav>

    <!-- hanburger -->
    <button
      class="md:hidden inline-flex items-center justify-center w-6 h-10 rounded focus:outline-none "
      aria-label="Open menu"
      @click="openMenu"
    >

      <svg class="" width="40" height="8" viewBox="0 0 40 8" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="4" cy="4" r="4" fill="white"/>
        <circle cx="20" cy="4" r="4" fill="white"/>
        <circle cx="36" cy="4" r="4" fill="white"/>
      </svg>

    </button>


    <!-- center -->
    <div class="logo hidden md:flex">
      <img class="w-[6rem]" src="../assets/img/mered2.svg" alt="Logo" />
    </div>

    <!-- right -->
    <div class="flex flex-row justify-end items-center md:w-[25rem]">
      <Langs class="hidden md:flex"/>
      <div class="btn">
        <uiMainButton :mode="'scrollToForm'" :size="'big'" :type="'button'" :text="$t('header.btn')"></uiMainButton>
      </div>
    </div>
  </header>

  <!-- Mobile Menu -->
  <MobileMenu />

</template> 


<script setup lang="ts">
import { ref, onMounted, watch, onBeforeUnmount } from 'vue'
import { useTmRaw } from '../composables/useTmRaw';
import { useMobileMenu } from "../composables/useMobileMenu";
const {
  openMenu,
} = useMobileMenu();
const { locale } = useI18n()
const contentVisible = ref(false)
const menu = useTmRaw('header.menu')

onMounted(() => {
  setTimeout(() => (contentVisible.value = true), 400)
})

</script>


<style scoped>
.header {
  position: fixed;
  left: 0; top: 0;
  width: 100%;
  background: rgba(0, 0, 0, 0.313);
  backdrop-filter: blur(0.5rem) brightness(0.8);
  z-index: 99;
}
</style>
