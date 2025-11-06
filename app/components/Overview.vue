<template>
  <section
    id="overview"
    class="hero-top mx-auto w-full md:max-w-5xl flex flex-col pt-16 md:pt-20 px-4 transition-all duration-2000"
    :class="{
      'opacity-100 translate-y-0': contentVisible,
      'opacity-90 translate-y-0': !contentVisible,
    }"
  >
    <div class="flex flex-col md:flex-row">
      <div class="basis-1/2">
        <div class="mb-15 pr-10">
          <p class="mb-3">
            In Dubai, it’s not easy to stand out for luxury — yet ICONIC goes
            beyond expectations. Every detail of these residences reflects
            precision, craftsmanship, and timeless design.
          </p>
          <p class="mb-3">
            The architecture and interiors, envisioned by Pininfarina, embody
            the harmony of Italian sophistication and contemporary innovation.
          </p>
        </div>
        <!--- --->
        <div class="flex flex-wrap mb-10">
          <div
            class="param mb-5 basis-1/3 md:basis-1/3 pr-10 md:pr-1"
            v-for="(param, index) in parametrs"
            :key="index"
          >
            <p class="value text-[1.75rem] mb-1">{{ param.value }}</p>
            <p class="title text-[1rem]">{{ param.text }}</p>
          </div>
        </div>
        <div class="flex flex-col md:flex-row mb-5 md:mb-0">
            <div class="btn p-1">
              <Button
                :size="'big'"
                :type="'button'"
                :text="'Download Floor Plans'"
                :icon="true"
                :link="'https://mered.ae/assets/docs/Iconic%20Residences%20Unit%20Layouts.pdf'"
              ></Button>
            </div>
            <div class="btn p-1">
              <Button
                :size="'big'"
                :type="'button'"
                :text="'Download Project Brochure'"
                :icon="true"
                :link="'https://mered.ae/assets/docs/Iconic%20Residences%20by%20Mered%20EN.pdf'"
              ></Button>
            </div>
          </div>
      </div>
      <div class="basis-1/2 relative">
        <img :src="image" alt="" class="object-cover h-full w-full" />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
const imageLoaded = ref(false);
const image = "/img/about.jpg";
const contentVisible = ref(false);
const parametrs = [
  {
    value: "G+66",
    text: "Floors",
  },
  {
    value: "3Q 2027",
    text: "Delivery date",
  },
  {
    value: "310",
    text: "1-4 Bedrooms Apartments",
  },
  {
    value: "1",
    text: "Penthouse",
  },
  {
    value: "2",
    text: "Floors of Exclusive Amenities",
  },
  {
    value: "423",
    text: "Parking Spaces",
  },
  {
    value: "18x2",
    text: "Vip Parking Boxes with A/C",
  },
];

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