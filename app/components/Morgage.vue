<template>
  <section
    id="morgage"
    class="mx-auto w-full md:max-w-6xl flex flex-col pt-20 md:pt-30 px-4 transition-all duration-2000"
    :class="{
      'opacity-100 translate-y-0': contentVisible,
      'opacity-90 translate-y-0': !contentVisible,
    }"
  >
    <div class="flex flex-col md:flex-row">
      <div class="basis-1/2 pr-0 md:pr-10 mb-10 md:mb-0">
        <div class="">
          <h3 class="text-[2.5rem] mb-10 uppercase text-center">
            Mortage options
          </h3>
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
      <div class="basis-1/2 pl-0 md:pl-10">
        <div class="mb-10">
          <h3 class="text-[2.5rem] mb-10 uppercase text-center">
            Payment Plan
          </h3>
          <p class="mb-3">
            Convenient payment schedule designed for comfort and flexibility.
          </p>

          <table class="table-auto border-collapse border border-gray-400">
            <thead>
              <tr class="bold text-left">
                <th class="border border-gray-300 p-2">Percent (%)</th>
                <th class="border border-gray-300 p-2">Paying date</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in planList" :key="index">
                <td class="border border-gray-300 p-2">{{ item.percent }}</td>
                <td class="border border-gray-300 p-2">{{ item.text }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="mb-1 pr-10">
          <h3 class="text-[2.5rem] mb-10 uppercase text-center">
            The Purchase Process
          </h3>
          <ul class="mb-3">
            <li>5% booking fee to reserve your apartment</li>
            <li>20% payment upon signing the SPA</li>
            <li>4% DLD registration fee + Oqood registration</li>
          </ul>
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