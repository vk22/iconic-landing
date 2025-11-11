<template>
    <section
      id="hero-top"
      class="hero-top mx-auto h-[100vh] w-full flex flex-col items-center text-center py-10 px-4 transition-all duration-2000"
      :class="{
        'opacity-100 translate-y-0': contentVisible,
        'opacity-90 translate-y-0': !contentVisible
      }"
    >
      <div class="relative z-10 flex flex-col items-center justify-end h-full"> 
        <div class="logo w-[12rem] md:w-[19rem] h-sm:w-[12rem] h-xs:w-[10rem] flex flex-col items-center">
          <img src="../assets/img/logo.svg" alt="" />
        </div>

        <div class="text-1 mt-[12vh] md:mt-[14vh] h-sm:mt-[10vh] h-sm:mt-[6vh]">
          <h1 class="text-white text-2xl md:text-3xl text-white! h-sm:text-2xl h-sm:text-xl">
           <span class="uppercase">{{ $t('title') }}</span> 
            <br />
            {{ $t('subtitle') }}
          </h1>
        </div>

        <div class="text-2 mt-[12vh] md:mt-[14vh] h-sm:mt-[12vh] h-sm:mt-[6vh] pb-4 max-w-xl">
          <!-- <a class="text-white text-lg md:text-2xl text-white! ">
          Premium Apartments starting from AED 3.5M / $970K
          </a> -->
          <Button :type="'button'" :text="'Premium Apartments starting from AED 3.5M / USD 970K'" size="big2"></Button>
        </div>
      </div>  

      <img src="../assets/img/award.png" class="award -top-[1rem] md:-top-[4rem] h-[12rem] sm:h-[20rem] md:h-[30rem] left-[1rem] md:left-[2rem]">

      <Swiper></Swiper>

    </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
const imageLoaded = ref(false);
const backgroundUrl = '/img/1.jpg' ;
const contentVisible = ref(false);

onMounted(() => {
  const img = new Image();
  img.src = backgroundUrl;
  img.onload = () => {
    imageLoaded.value = true;
    setTimeout(() => (contentVisible.value = true), 300)
  }
})
</script>

<style scoped>
.hero-top {
  position: relative;
  /* background-image: linear-gradient(rgba(0, 0, 0, 0.527),rgba(0, 0, 0, 0.5)), url("/img/1.jpg");
  background-position: center center;
  background-size: cover; */
}

.award {
    position: absolute;
    width: unset;
    pointer-events: none;
    -o-object-fit: contain;
    object-fit: contain;
    z-index: 9999;
}

.accent-color {
  
}


</style>