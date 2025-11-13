<template>
  <button
    v-if="!link"
    :type="type"
    @click="scrollToForm"
    :class="`relative btn ${size} text-center inline-flex items-center cursor-pointer text-white uppercase bg-[#434848] focus:outline-none font-medium ${textSize} tracking-[1.25px] ${animate}`"
  >
    <span class="relative z-10 flex items-center">
      <svg
        v-if="icon"
        class="mr-2"
        width="17"
        height="15"
        viewBox="0 0 17 15"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M11.5458 5.31818L9.20833 7.55455V0H7.79167V7.56136L5.45417 5.31136L4.4625 6.27955L8.5 10.1659L12.5375 6.27955L11.5458 5.31818ZM1.41667 12.2727V8.86364H0V12.2727C0 12.996 0.298511 13.6897 0.829864 14.2012C1.36122 14.7127 2.08189 15 2.83333 15H14.1667C14.9181 15 15.6388 14.7127 16.1701 14.2012C16.7015 13.6897 17 12.996 17 12.2727V8.86364H15.5833V12.2727C15.5833 12.6344 15.4341 12.9812 15.1684 13.237C14.9027 13.4927 14.5424 13.6364 14.1667 13.6364H2.83333C2.45761 13.6364 2.09728 13.4927 1.8316 13.237C1.56592 12.9812 1.41667 12.6344 1.41667 12.2727Z"
        />
      </svg>
      {{ text }}</span>
  </button>
  <a
    v-else
    target="_blank"
    download
    :class="`relative btn ${size} text-center inline-flex items-center cursor-pointer text-white uppercase bg-[#434848] hover:bg-[#000000] focus:outline-none font-small md:font-medium  ${textSize} tracking-[1.25px] ${animate}`"
  >
    <span class="relative z-10 flex items-center">
      <svg
        v-if="icon"
        class="mr-2"
        width="17"
        height="15"
        viewBox="0 0 17 15"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M11.5458 5.31818L9.20833 7.55455V0H7.79167V7.56136L5.45417 5.31136L4.4625 6.27955L8.5 10.1659L12.5375 6.27955L11.5458 5.31818ZM1.41667 12.2727V8.86364H0V12.2727C0 12.996 0.298511 13.6897 0.829864 14.2012C1.36122 14.7127 2.08189 15 2.83333 15H14.1667C14.9181 15 15.6388 14.7127 16.1701 14.2012C16.7015 13.6897 17 12.996 17 12.2727V8.86364H15.5833V12.2727C15.5833 12.6344 15.4341 12.9812 15.1684 13.237C14.9027 13.4927 14.5424 13.6364 14.1667 13.6364H2.83333C2.45761 13.6364 2.09728 13.4927 1.8316 13.237C1.56592 12.9812 1.41667 12.6344 1.41667 12.2727Z"
        />
      </svg>
      {{ text }}</span>
  </a>
</template>

<script setup lang="ts">
const props = defineProps({
  text: {
    type: String,
    default: "Submit",
  },
  link: {
    type: String,
    default: "",
  },
  type: {
    type: String,
    default: "button",
  },
  size: {
    type: String,
    default: "small",
  },
  icon: {
    type: Boolean,
    default: false,
  },
});

import { ref, computed } from "vue";
const formSection = ref(null);

// const xSize = computed(() => {
//   return props.size === "big" ? 5.5 : 2.5;
// });

// const ySize = computed(() => {
//   return props.size === "big" ? 3 : 1.5;
// });

const colorBg = "#434848";

const animate =
  "hover:text-black transition-colors duration-300 before:content-[''] before:absolute before:left-0 before:bottom-0 before:w-full before:h-full before:bg-[#faf3e9] before:origin-bottom before:scale-y-0 before:transition-transform before:duration-300 hover:before:scale-y-100 before:z-0";

const sizes = {
  big2: "text-[.85rem] md:text-[.95rem]",
  big: "text-[.75rem] md:text-[.75rem]",
  small: "text-[.65rem] md:text-[.7rem]",
};

const textSize = computed(() => {
  return sizes[props.size];
});

const scrollToForm = () => {
  if (props.type !== "submit") {
    document.getElementById("forma")?.scrollIntoView({ behavior: "smooth" });
  }
};
</script>

<style scoped>
.btn.big2 {
  padding: 0.5rem 1rem;
}

.btn.big {
  padding: 0.5rem 1rem;
}

.btn.small {
  padding: 0.5rem 0.75rem;
  border: none;
}
</style>