<template>
  <section
    id="overview"
    class="hero-top mx-auto w-full md:max-w-5xl flex flex-col pt-10 md:pt-20 px-4 transition-all duration-2000"
    :class="{
      'opacity-100 translate-y-0': contentVisible,
      'opacity-90 translate-y-0': !contentVisible,
    }"
  >
    <div class="flex flex-col md:flex-row">
      <div class="basis-1/2 pr-0 md:pr-4">
        <div class="mb-10 pr-0 md:pr-10 text-center md:text-left">
          <p class="mb-3">
            Iconic Residences by Pininfarina reflect Italian luxury, modern
            innovation and European craftsmanship in the heart of Dubai. These
            Branded Residences are created for those who appreciate
            sophistication, comfort and a prestigious address.
          </p>
          <p class="mb-3">Why Iconic Residences</p>

          <ul class="list-disc pl-5 mb-3">
            <li>Exclusive Pininfarina design defined by contemporary elegance and precise architectural detailing.</li>
            <li>Spectacular seascape and iconic skyline views that encompass Palm Jumeirah, Dubai Marina and the Burj Al Arab.</li>
            <li>Generous, well-proportioned layouts complemented by balconies and terraces that open fully to the views.</li>
            <li>Refined materials, including premium wood and marble finishes that elevate the quality of every residence.</li>
          </ul>

          
        </div>

      </div>
      <div class="basis-1/2 relative ">
        <!--- parametrs --->
        <div class="flex flex-wrap mb-6 bg-[#f2f2ffff2] p-0 md:mr-5">
          <div
            class="param mb-5 md:mb-14 basis-1/2 md:basis-1/3 pr-0 md:pr-2 text-center md:text-left"
            v-for="(param, index) in parametrs"
            :key="index"
          >
            <p class="text-title value text-[1.25rem] md:text-[1.65rem] mb-2">
              {{ param.value }}
            </p>
            <p class="title text-[0.75rem] md:text-[.85rem]">
              {{ param.text }}
            </p>
          </div>
        </div>
        <div
          class="flex flex-col md:flex-row items-center md:items-start mb-5 md:mb-0"
        >
          <div class="btn pr-0 md:pr-2 w-full md:w-auto mb-1 md:mb-0">
            <Button
              link="#"
              :size="'big'"
              :type="'button'"
              :text="'Download Floor Plans'"
              :icon="true"
              @click="openForm"
              class="w-full md:w-auto"
            ></Button>
          </div>
          <div class="btn pr-0 md:pr-2 w-full md:w-auto">
            <Button
              :size="'big'"
              :type="'button'"
              :text="'Download Project Brochure'"
              :icon="true"
              :link="'#'"
              @click="openForm"
              class="w-full md:w-auto"
            ></Button>
          </div>
        </div>
      </div>
    </div>
     <div class="flex flex-col md:flex-row justify-center mt-10">
          <p class="text-center text-[1.25rem] md:text-[1.65rem] basis-1/2 text-title">
           Living at Iconic Residences means choosing exceptional quality, elevated comfort and a truly refined lifestyle in Dubai.
          </p>
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
    text: "Tower floors",
  },
  {
    value: "310",
    text: "Apartments",
  },
  {
    value: "1",
    text: "Penthouse",
  },
  {
    value: "VIP parking",
    text: "with A/C",
  },
  {
    value: "2 levels",
    text: "of Amenities",
  },
  {
    value: "3Q 2027",
    text: "Delivery date",
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