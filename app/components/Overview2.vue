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
      <div class="basis-1/2 pr-4">
        <div class="mb-10 pr-10">
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
        <!--- parametrs --->
        <div class="flex flex-wrap mb-6 bg-[#f2f2ffff2] p-0 md:mr-5">
          <div
            class="param mb-5 basis-1/2 md:basis-1/4 pr-1 pr-0 md:pr-10"
            v-for="(param, index) in parametrs"
            :key="index"
          >
            <p class="value text-[1.25rem] md:text-[1.65rem] mb-1">
              {{ param.value }}
            </p>
            <p class="title text-[0.75rem] md:text-[.85rem]">
              {{ param.text }}
            </p>
          </div>
        </div>
        <div class="flex flex-col md:flex-row mb-5 md:mb-0">
          <div class="btn pr-2">
            <Button
              link="#"
              :size="'big'"
              :type="'button'"
              :text="'Download Floor Plans'"
              :icon="true"
              @click="openForm"
            ></Button>
          </div>
          <div class="btn pr-2">
            <Button
              :size="'big'"
              :type="'button'"
              :text="'Download Project Brochure'"
              :icon="true"
              :link="'#'"
              @click="openForm"
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
import { ref, onMounted, watch } from "vue";
import { usePopup } from "../composables/usePopup";
const {
  isPopupOpen,
  isFormOpen,
  isSuccessOpen,
  setPopupMode,
  setFormMode,
  setSuccessMode,
  setResult,
  formResult,
} = usePopup();
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
    value: "2",
    text: "Floors of Exclusive Amenities",
  },
  {
    value: "1",
    text: "Penthouse",
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

//// Form Popup
const openForm = () => {
  setPopupMode(true);
  setFormMode(true);
};

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