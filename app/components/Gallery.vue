<template>
  <section
    id="gallery"
    class="relative mx-auto w-full h-[15rem] md:h-[40rem] md:max-w-5xl flex flex-col mt-2 md:mt-4 px-0 md:px-4 transition-all duration-2000"
    :class="{
      'opacity-100 translate-y-0': contentVisible,
      'opacity-90 translate-y-0': !contentVisible,
    }"
  >
    <ClientOnly>
      <div class="gallery-nav px-4 md:px-12">
        <div class="gallery-nav__arrow swiper-prev h-[2rem] w-[2rem] md:h-[2.5rem] md:w-[2.5rem]">
          <svg
            class="swiper-navigation-icon"
            width="11"
            height="20"
            viewBox="0 0 11 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0.38296 20.0762C0.111788 19.805 0.111788 19.3654 0.38296 19.0942L9.19758 10.2796L0.38296 1.46497C0.111788 1.19379 0.111788 0.754138 0.38296 0.482966C0.654131 0.211794 1.09379 0.211794 1.36496 0.482966L10.4341 9.55214C10.8359 9.9539 10.8359 10.6053 10.4341 11.007L1.36496 20.0762C1.09379 20.3474 0.654131 20.3474 0.38296 20.0762Z"
              fill="currentColor"
            ></path>
          </svg>
        </div>
        <!-- <h2>Gallery</h2> -->
        <div class="gallery-nav__arrow swiper-next h-[2rem] w-[2rem] md:h-[2.5rem] md:w-[2.5rem]">
          <svg
            class="swiper-navigation-icon"
            width="11"
            height="20"
            viewBox="0 0 11 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0.38296 20.0762C0.111788 19.805 0.111788 19.3654 0.38296 19.0942L9.19758 10.2796L0.38296 1.46497C0.111788 1.19379 0.111788 0.754138 0.38296 0.482966C0.654131 0.211794 1.09379 0.211794 1.36496 0.482966L10.4341 9.55214C10.8359 9.9539 10.8359 10.6053 10.4341 11.007L1.36496 20.0762C1.09379 20.3474 0.654131 20.3474 0.38296 20.0762Z"
              fill="currentColor"
            ></path>
          </svg>
        </div>
      </div>
      <Swiper
        :modules="[Navigation, EffectFade]"
        effect="fade"
        :fadeEffect="{ crossFade: true }"
        :speed="1000"
        :navigation="{
          enabled: true,
          nextEl: '.swiper-next',
          prevEl: '.swiper-prev',
        }"
        :loop="true"
      >
        <SwiperSlide v-for="slide in slides" :key="slide">
          <img :alt="slide.image" :src="slide.image" />
        </SwiperSlide>
      </Swiper>
    </ClientOnly>
  </section>
</template>
<script setup>
import { Swiper, SwiperSlide } from "swiper/vue";
import { Navigation, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";
const url = "slider-product";
const slides = [
  { image: "/img/gallery-1.jpg" },
  { image: "/img/gallery-3.jpg" },
  { image: "/img/gallery-4.jpg" },
  { image: "/img/gallery-5.jpg" },
  { image: "/img/gallery-2.jpg" },
  { image: "/img/gallery-7.jpg" },
  { image: "/img/gallery-6.jpg" },
  { image: "/img/gallery-8.jpg" },
  { image: "/img/gallery-9.jpg" },
  { image: "/img/gallery-10.jpg" }
];

const imageLoaded = ref(false);
const contentVisible = ref(false);

const onSwiper = (swiper) => swiper;
const onSlideChange = () => {};

onMounted(() => {
  const img = new Image();
  img.src = slides[0].image;
  img.onload = () => {
    imageLoaded.value = true;
    setTimeout(() => (contentVisible.value = true), 300);
  };
});
</script>

<style scoped>
.swiper {
  width: 100%;
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

.gallery-nav {
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  width: 100%;
  height: 100%;
  justify-content: space-between;
  align-items: center;
}
.gallery-nav__arrow {
  cursor: pointer;
  /* width: 50px;
  height: 50px; */
  z-index: 99;
  color: #ad9b84;
  /* background-color: rgba(255, 255, 255, 0.5); */
  background-color: #faf3e9;
  padding: 15px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 999px;
}

.gallery-nav__arrow svg {
  scale: .6;
}

.gallery-nav__arrow.swiper-next {

}

.gallery-nav__arrow.swiper-prev {
  transform: rotate(180deg);
}
</style>