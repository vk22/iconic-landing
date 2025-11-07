<template>
  <section
    id="location"
    class="mx-auto w-full md:max-w-5xl flex flex-col pt-16 md:pt-20 px-4 transition-all duration-2000 items-center"
    :class="{
      'opacity-100 translate-y-0': contentVisible,
      'opacity-90 translate-y-0': !contentVisible,
    }"
  >
    <div class="flex flex-col items-center">
      <div class="text-center mb-3 md:mb-6 max-w-xl">
        <TitleH3 :text="'CENTRAL LOCATION'" :align="'center'"></TitleH3>
        <p class="mb-3">
          Perfectly positioned in the heart of Dubai Internet City, ICONIC offers unparalleled connectivity and proximity to Dubai’s most renowned destinations.
        </p>
      </div>
    </div>


    <div class="flex flex-wrap pt-5 justify-center w-full md:max-w-5xl">
      <div
        class="param mb-10 basis-1/2 md:basis-1/4 px-4 text-center"
        v-for="(param, index) in parametrs"
        :key="index"
        :class="borderNeed(parametrs.length, index)"
      >
        <p class="value mb-1 bold">{{ param.place }}</p>
        <p class="title text-[#6a7285]">{{ param.text }}</p>
      </div>
    </div>

    <div class="flex mb-15 justify-center w-full h-[50vh]">
        <img :src="image" alt="" @click="openMenu" class="object-cover h-full w-full md:max-w-5xl cursor-pointer"/>
    </div>


    <div class="flex justify-center">
      <div class="btn pr-1">
        <Button :size="'big'" :type="'button'" :text="'Register your interest'"></Button>
      </div>
    </div>
  </section>

   <!-- POPUP MENU -->
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
const imageLoaded = ref(false);
const image = "/img/map.png";
const contentVisible = ref(false);
const parametrs = [
  {
    place: "Palm Jumeirah Beaches",
    text: "5 minutes by car",
  },
  {
    place: "Dubai Harbour",
    text: "10 minutes by car",
  },
  {
    place: "Bluewaters Island",
    text: "10 minutes by car",
  },
  {
    place: "Downtown Dubai",
    text: "25 minutes by car",
  }
];

const borderNeed = (length: number, index: number) => {
  if (index < length - 1) {
    return 'border-r-1 border-grey-light';
  }
}

/* --- mobile popup state + UX --- */
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