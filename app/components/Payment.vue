<template>
  <section
    id="payment"
    class="mx-auto w-full md:max-w-5xl flex flex-col pt-10 md:pt-20 px-4 transition-all duration-2000"
    :class="{
      'opacity-100 translate-y-0': contentVisible,
      'opacity-90 translate-y-0': !contentVisible,
    }"
  >
    <div class="flex flex-col md:flex-row">
      <div class="basis-1/2 pl-0 md:pr-10">
        <div class="mb-10">
          <uiTitleH3 :text="$t('payments.title')" :align="'center'"></uiTitleH3>
          <p class="mb-6">
            {{ $t("payments.text") }}
          </p>

          <div class="relative flex flex-col md:flex-row overflow-x-auto">
            <div
              class="param basis-1/2 md:basis-1/2 px-2 md:px-2 text-left md:text-left border-l border-grey-dark mb-4"
              v-for="(item, index) in planList"
              :key="index"
            >
              <p
                class="text-title text-left value text-[1rem] md:text-[1.25rem] mb-1"
              >
                {{ item.percent }}
              </p>
              <p class="text-left text-[0.75rem] md:text-[.75rem]">
                {{ item.text }}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div class="basis-1/2 pr-0 md:pl-10 mb-10 md:mb-0">
        <div class="">
          <uiTitleH3 :text="$t('mortgage.title')" :align="'center'"></uiTitleH3>
          <p class="mb-3">
            {{ $t("mortgage.text-1") }}
          </p>
          <p class="mb-3">
            {{ $t("mortgage.text-2") }}
          </p>

          <p>{{ $t("mortgage.text-3") }}</p>
          <ul class="list-disc pl-5 mb-3">
            <li>{{ $t("mortgage.list-1") }}</li>
            <li>{{ $t("mortgage.list-2") }}</li>
            <li>{{ $t("mortgage.list-3") }}</li>
          </ul>
          <p>{{ $t("mortgage.text-4") }}</p>
        </div>
      </div>
    </div>
    <div class="flex flex-col md:flex-row justify-center pt-2 md:pt-12">
      <div class="basis-1/2">
        <div class="flex flex-col items-center">
          <uiTitleH3 :text="$t('goldenVisa.title')" :align="'center'"></uiTitleH3>
          <p class="mb-3 text-center">
            {{ $t("goldenVisa.text-1") }}
          </p>
          <ul class="list-disc pl-5 mb-3">
            <li>{{ $t("goldenVisa.list-1") }}</li>
            <li>{{ $t("goldenVisa.list-2") }}</li>
            <li v-if="$t('goldenVisa.list-3')">{{ $t("goldenVisa.list-3") }}</li>
          </ul>

          <div class="btn pt-6">
            <uiMainButton
              :mode="'scrollToForm'"
              :size="'big'"
              :type="'button'"
              :text="$t('goldenVisa.btn')"
            ></uiMainButton>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useTmRaw } from "../composables/useTmRaw";
const imageLoaded = ref(false);
const image = "/img/about.jpg";
const contentVisible = ref(false);
const planList = useTmRaw("payments.planList");

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