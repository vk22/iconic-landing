<template>
  <Teleport to="body">
    <transition name="slide">
      <div
        v-if="isMenuOpen"
        class="fixed inset-0 z-[999] flex"
        @keydown.esc="closeMenu"
        role="dialog"
        aria-modal="true"
        :dir="isRtl ? 'rtl' : 'ltr'"
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
               <Langs />
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

            <div class="w-full flex align-center justify-between" :class="locale === 'ar' ? 'flex-row-reverse' : 'flex-row'">
              <img class="h-3" src="../assets/img/mered2.svg" alt="Logo" /> 
            </div>
          </div>
        </transition>
      </div>
    </transition>
  </Teleport>

</template> 


<script setup lang="ts">
import { onMounted, watch, onBeforeUnmount } from 'vue'
import { useI18n } from 'vue-i18n'
import { useTmRaw } from '../composables/useTmRaw';
import { useMobileMenu } from "../composables/useMobileMenu";
const {
  isMenuOpen,
  closeMenu,
} = useMobileMenu();

const menu = useTmRaw('header.menu')
const { locale } = useI18n();
const isRtl = computed(() => locale.value === 'ar')

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
