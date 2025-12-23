<template>
  <section
    id="hero-top"
    class="relative mx-auto h-[100svh] w-full flex flex-col items-center text-center py-10 px-4 transition-all duration-2000"
    :class="{
      'opacity-100 translate-y-0': contentVisible,
      'opacity-90 translate-y-0': !contentVisible,
    }"
  >
    <div class="relative z-10 flex flex-col items-center justify-end h-full">
      <div
        class="logo w-[13rem] md:w-[19rem] h-sm:w-[13rem] h-xs:w-[11rem] flex flex-col items-center"
      >
        <img src="../assets/img/logo.svg" alt="" />
      </div>

      <div class="mt-[12vh] md:mt-[14vh] h-sm:mt-[10vh] h-sm:mt-[6vh]">
        <div
          class="text-white text-[1rem] md:text-3xl text-white! h-sm:text-[1rem] h-xs:text-[1rem]"
        >
          <span class="uppercase">{{ $t("hero.title") }}</span>
          <br />
          {{ $t("hero.subtitle") }}
        </div>
      </div>

      <div
        class="text-2 mt-[12vh] md:mt-[14vh] h-sm:mt-[12vh] h-sm:mt-[6vh] pb-4 max-w-xl"
      >
        <uiMainButton
          :mode="'scrollToForm'"
          :type="'button'"
          :text="$t('hero.btn-1')"
          :text2="$t('hero.btn-2')"
          size="big"
        ></uiMainButton>
      </div>
    </div>
    <img
      src="../assets/img/award.png"
      class="award -top-[1rem] md:-top-[4rem] h-[12rem] sm:h-[20rem] md:h-[30rem] left-[1rem] md:left-[2rem]"
    />
    <Swiper></Swiper>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
const imageLoaded = ref(false);
const backgroundUrl = "/img/top-1.jpg";
const contentVisible = ref(false);

onMounted(() => {
  const img = new Image();
  img.src = backgroundUrl;
  img.onload = () => {
    imageLoaded.value = true;
    setTimeout(() => (contentVisible.value = true), 300);
  };
});
</script>

<style scoped>
.award {
  position: absolute;
  width: unset;
  pointer-events: none;
  -o-object-fit: contain;
  object-fit: contain;
  z-index: 9999;
}
</style>