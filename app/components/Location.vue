<template>
  <section
    id="location"
    class="mx-auto w-full md:max-w-5xl flex flex-col pt-20 md:pt-30 px-4 transition-all duration-2000 items-center"
    :class="{
      'opacity-100 translate-y-0': contentVisible,
      'opacity-90 translate-y-0': !contentVisible,
    }"
  >
    <div class="flex flex-col items-center">
      <div class="text-center mb-1 max-w-xl">
        <h3 class="text-[2.5rem] mb-10">CENTRAL LOCATION</h3>
        <p class="mb-3 ">
     Perfectly positioned in the heart of Dubai Internet City, ICONIC offers unparalleled connectivity and proximity to Dubai’s most renowned destinations.
        </p>
      </div>
    </div>


    <div class="flex flex-wrap pt-15 justify-center w-full md:max-w-5xl">
      <div
        class="param mb-15 basis-1/2 md:basis-1/4 px-4 text-center"
        v-for="(param, index) in parametrs"
        :key="index"
        :class="borderNeed(parametrs.length, index)"
      >
        <p class="value  mb-2 bold">{{ param.place }}</p>
        <p class="title text-[1rem] text-[#6a7285]">{{ param.text }}</p>
      </div>
    </div>

    <div class="flex mb-20 justify-center">
        <img :src="image" alt="" class="w-full md:max-w-5xl"/>
    </div>


    <div class="flex justify-center">
      <div class="btn pr-1">
        <Button :size="'big'" :type="'button'" :text="'Register your interest'"></Button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
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