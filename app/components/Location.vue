<template>
  <section
    id="location"
    class="mx-auto w-full md:max-w-5xl flex flex-col pt-10 md:pt-20 px-4 transition-all duration-2000 items-center"
    :class="{
      'opacity-100 translate-y-0': contentVisible,
      'opacity-90 translate-y-0': !contentVisible,
    }"
  >
    <div class="flex flex-col items-center">
      <div class="text-center mb-3 md:mb-6 max-w-xl">
        <uiTitleH3 :text="$t('location.title')" :align="'center'"></uiTitleH3>
        <p class="mb-3">
         {{ $t('location.text') }}
        </p>
      </div>
    </div>


    <div class="flex flex-wrap pt-5 justify-center w-full md:max-w-5xl">
      <div
        class="param mb-10 basis-1/2 md:basis-1/4 px-2 md:px-4 text-center"
        v-for="(param, index) in parameters"
        :key="index"
        :class="borderNeed(parameters.length, index)"
      >
        <p class="value mb-1 bold text-[.9rem] md:text-[1rem]">{{ param.place }}</p>
        <p class="title text-[#6a7285]">{{ param.text }}</p>
      </div>
    </div>


    <div class="relative flex mb-10 justify-center w-full h-[50vh] overflow-hidden">
      <!-- <div class="relative w-full overflow-x-scroll">
        <div class="absolute w-[30rem] md:w-full">
          <img :src="image" alt="" @click="openMenu" class="object-cover h-full w-full md:max-w-5xl cursor-pointer"/>
        </div>
      </div> -->

      <img :src="image" alt="" @click="openMenu" class="object-cover h-full w-full md:max-w-5xl cursor-pointer"/>
       
    </div>


    <div class="flex justify-center">
      <div class="btn pr-1">
        <uiMainButton :mode="'scrollToForm'" :size="'big'" :type="'button'" :text="$t('location.btn')"></uiMainButton>
      </div>
    </div>
  </section>

   <Teleport to="body">
    <transition name="fade">
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
        <transition name="slide">
          <div
            class="relative ml-auto h-full w-[100%] text-white px-6 py-6 flex flex-col justify-center items-center"
          >
            <button
              class="absolute top-5 right-5 inline-flex w-auto h-auto rounded focus:outline-none cursor-pointer"
              aria-label="Close menu"
              @click="closeMenu"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="1">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>

            <div class="">
               <img :src="image" alt="" class="h-full w-full" @click="closeMenu"/>
            </div>
          </div>
        </transition>
      </div>
    </transition>
  </Teleport>

</template>

<script setup lang="ts">
import { ref, onMounted, watch, onBeforeUnmount } from "vue";
import { useTmRaw } from '../composables/useTmRaw';
const imageLoaded = ref(false);
const image = "/img/map.png";
const contentVisible = ref(false);
const parameters = useTmRaw('location.parameters');

const borderNeed = (length: number, index: number) => {
  if (index < length - 1) {
    return 'border-r-1 border-grey-light';
  }
}

const isMenuOpen = ref(false)

const openMenu  = () => ( isMenuOpen.value = true )
const closeMenu = () => ( isMenuOpen.value = false )

// Блокируем прокрутку фона, когда открыт попап
watch(isMenuOpen, (open) => {
  const cls = document.documentElement.classList
  if (open) cls.add('overflow-hidden')
  else cls.remove('overflow-hidden')
})

// Закрытие по Esc (на случай если фокус не в оверлее)
const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') closeMenu() }
onMounted(() => window.addEventListener('keydown', onKey))
onBeforeUnmount(() => window.removeEventListener('keydown', onKey))

onMounted(() => {
  const img = new Image();
  img.src = image;
  img.onload = () => {
    imageLoaded.value = true;
    setTimeout(() => (contentVisible.value = true), 300);
  };
});
</script>

<style scoped>
.hero-top {
  position: relative;
  /* background-image: linear-gradient(rgba(0, 0, 0, 0.527),rgba(0, 0, 0, 0.5)), url("/img/1.jpg");
  background-position: center center;
  background-size: cover; */
}
</style>