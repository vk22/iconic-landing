<template>
  <ClientOnly>
    <div class="bg-black absolute top-0 left-0 w-full h-full z-0">
      <Swiper
        :modules="[Autoplay, EffectFade]"
        effect="fade"
        :fadeEffect="{ crossFade: true }"
        :speed="2000"
        :autoplay="{ delay: 6000, disableOnInteraction: false }"
        :loop="true"
        class="opacity-50"
      >
        <SwiperSlide v-for="slide in slides" :key="slide">
          <img :alt="slide.image" :src="slide.image" />
        </SwiperSlide>
      </Swiper>
    </div>
  </ClientOnly>
</template>
<script setup>
import { Swiper, SwiperSlide } from "swiper/vue";
import { Autoplay, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";
const url = "slider-product";
const slides = [
  { image: "/img/1.jpg" },
  { image: "/img/2.jpg" },
  { image: "/img/3.jpg" },
  { image: "/img/4.jpg" },
  { image: "/img/5.jpg" },
  { image: "/img/6.jpg" },
  { image: "/img/7.jpg" },
];

const onSwiper = (swiper) => swiper;
const onSlideChange = () => {};
</script>

<style scoped>
.swiper{
  height: 100%;
  overflow: hidden;
}

.swiper-slide img {
    overflow: hidden;
    width: 100%;
    height: 100%;
    object-fit: cover;
    /* object-position: 100% 100%; */
}

</style>