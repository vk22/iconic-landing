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

  <!-- POPUP MENU -->
  <Teleport to="body">
    <transition name="slide">
      <div
        v-if="isMenuOpen"
        class="fixed inset-0 z-[999] flex"
        @keydown.esc="closeMenu"
        role="dialog"
        aria-modal="true"
      >
        <!-- backdrop -->
        <div class="absolute inset-0 bg-[#0d1313f0]" @click="closeMenu" />

        <!-- panel -->
        <transition name="fade">
          <div
            class="relative ml-auto h-full w-[100%] text-white px-4 py-4 flex flex-col justify-between"
             v-if="isMenuOpen"
          >
            <div class="flex items-center justify-between">
              <button
                class="inline-flex items-center justify-center w-auto h-auto rounded focus:outline-none"
                aria-label="Close menu"
                @click="closeMenu"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" stroke-width="1">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>

            <nav class="flex justify-center">
              <ul class="space-y-4 flex flex-col justify-center ml-1 mt-4">
                <li v-for="(item, i) in menu" :key="i" class="text-center py-2">
                  <nuxt-link
                    :to="{ hash: item.id }"
                    :external="true"
                    class="text-white text-[.85rem] uppercase text-start tracking-[1.25px]"
                    @click="closeMenu"
                  >
                    {{ item.text }}
                  </nuxt-link>
                </li>
              </ul>
            </nav>

            <div class="w-full flex flex-row align-center justify-between">
              <img class="h-3" src="../assets/img/mered2.svg" alt="Logo" /> 
              <Langs />
              <!-- <div class="mt-4">
                <uiMainButton :type="'button'" :text="'Register your interest'" @click="closeMenu" />
              </div> -->
            </div>
          </div>
        </transition>
      </div>
    </transition>
  </Teleport>

</template> 


<script setup lang="ts">
import { ref, onMounted, watch, onBeforeUnmount } from 'vue'
import { useTmRaw } from '../composables/useTmRaw';
const { locale, locales } = useI18n()
const contentVisible = ref(false)

const menu = useTmRaw('header.menu')


onMounted(() => {
  setTimeout(() => (contentVisible.value = true), 400)
})


/// popup menu
const isMenuOpen = ref(false)
const openMenu  = () => ( isMenuOpen.value = true )
const closeMenu = () => ( isMenuOpen.value = false )

watch(isMenuOpen, (open) => {
  const cls = document.documentElement.classList
  if (open) cls.add('overflow-hidden')
  else cls.remove('overflow-hidden')
})

const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') closeMenu() }
onMounted(() => window.addEventListener('keydown', onKey))
onBeforeUnmount(() => window.removeEventListener('keydown', onKey))

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
