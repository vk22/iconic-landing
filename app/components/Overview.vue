<template>
  <section
    id="overview"
    class="hero-top mx-auto w-full md:max-w-5xl flex flex-col pt-10 md:pt-20 px-4 transition-all duration-2000"
    :class="{
      'opacity-100 translate-y-0': contentVisible,
      'opacity-90 translate-y-0': !contentVisible,
    }"
  >
    <div class="flex flex-col items-center">
      <div class="text-center mb-3 md:mb-6 max-w-xl">
        <uiTitleH3 :text="$t('overview.title')" :align="'center'"></uiTitleH3>
      </div>
    </div>

    <div class="flex flex-col md:flex-row items-stretch">
      <div class="basis-1/2 px-0 md:px-4">
        <div class="mb-10 pr-0 md:pr-10 text-start md:text-start">
          <p class="mb-3">
              {{ $t('overview.text.paragraph-1') }}
          </p>
          <ul class="list-disc pl-5 mb-3">
            <li>
              {{ $t('overview.text.list-1') }}
            </li>
            <li>
              {{ $t('overview.text.list-2') }}
            </li>
            <li>
              {{ $t('overview.text.list-3') }}
            </li>
            <li>
              {{ $t('overview.text.list-4') }}
            </li>
          </ul>
          <p class="mb-3">
             {{ $t('overview.text.paragraph-2') }}
          </p>
        </div>
        <div
          class="flex flex-col md:flex-row items-center md:items-start mb-5 md:mb-0"
        >
          <div class="btn pr-0 md:pr-2 w-full md:w-auto mb-1 md:mb-0">
            <uiMainButton
              :mode="'openForm'" 
              :size="'big'"
              :type="'button'"
              :text="$t('overview.btn-1')"
              :icon="true"
              @click="openForm"
              class="w-full md:w-auto"
            ></uiMainButton>
          </div>
          <div class="btn pr-0 md:pr-2 w-full md:w-auto">
            <uiMainButton
              :mode="'openForm'" 
              :size="'big'"
              :type="'button'"
              :text="$t('overview.btn-2')"
              :icon="true"
              @click="openForm"
              class="w-full md:w-auto"
            ></uiMainButton>
          </div>
        </div>
      </div>
      <div class="right basis-1/2 hidden lg:block relative overflow-hidden">
        <img
          :src="image"
          alt=""
          class="absolute inset-0 w-full h-full object-cover object-bottom"
        />
      </div>
    </div>
    <div class="flex flex-col md:flex-col justify-center mt-2 md:mt-10">      
      <div class="flex flex-wrap mb-6 bg-[#fff] p-0 md:p-6 rounded-xl">
        <div
          class="param basis-1/2 md:basis-1/3 p-3 md:p-4 text-center md:text-start text-[#555b6d]"
          v-for="(param, index) in parameters"
          :key="index"
        >
          <p
            class="text-center value text-[1.25rem] md:text-[1.75rem] mb-1"
          >
            {{ param.value }}
          </p>
          <p class="text-center text-[0.75rem] md:text-[1rem]">
            {{ param.text }}
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { gtmPush } from "../utils/gtm";
import { usePopup } from "../composables/usePopup";
import { useTmRaw } from '../composables/useTmRaw';
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
const parameters = useTmRaw('overview.parameters')


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

</style>