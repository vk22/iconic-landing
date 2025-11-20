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
          <TitleH3 :text="'Payment Plan'" :align="'center'"></TitleH3>
          <p class="mb-6">
            Convenient payment schedule designed for comfort and flexibility.
          </p>

          <div class="relative flex overflow-x-auto">
            <div
              class="param basis-1/2 md:basis-1/2 px-2 md:px-2 text-left md:text-left border-l border-grey-dark"
              v-for="(item, index) in planList"
              :key="index"
            >
              <p
                class="text-title text-left value text-[1rem] md:text-[1.25rem] mb-1 "
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
          <TitleH3 :text="'Mortgage options'" :align="'center'"></TitleH3>
          <p class="mb-3">
            Mortgages are available even if you're not a UAE resident. You can
            finance up to half the property value and get full support
            throughout the process.
          </p>
          <p class="mb-3">
            Support: Full assistance from our mortgage partner — from
            application to approval.
          </p>

          <p>Available for:</p>
          <ul class="list-disc pl-5 mb-3">
            <li>UAE residents</li>
            <li>Golden Visa holders</li>
            <li>Non-residents with international income</li>
          </ul>
          <p>Up to 50% of property value can be financed.</p>
        </div>
      </div>
    </div>
    <div class="flex flex-col md:flex-row justify-center pt-2 md:pt-12">
      <div class="basis-1/2">
        <div class="flex flex-col items-center">
          <TitleH3
            :text="'SECURE YOUR 10-YEAR UAE GOLDEN VISA'"
            :align="'center'"
          ></TitleH3>
          <p class="mb-3 text-center">
            Invest in Iconic Residences design by Pininfarina and enjoy the
            exclusive benefits of a 10-year UAE Golden Visa.
          </p>
          <p class="mb-3 text-center">
            Residency for you & your family. No restrictions on time spent
            outside the UAE.
          </p>

          <div class="btn pt-6">
            <Button
              :size="'big'"
              :type="'button'"
              :text="'Leave a Request'"
            ></Button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
const imageLoaded = ref(false);
const image = "/img/about.jpg";
const contentVisible = ref(false);
const planList = [
  {
    percent: "5%",
    text: "Booking Deposit",
  },
  {
    percent: "20%",
    text: "Upon SPA Agreement date",
  },
  {
    percent: "30%",
    text: "In equal installments within 6 to 30 months from Agreement date",
  },
  {
    percent: "50%",
    text: "Upon Handover",
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