<template>
  <button
    v-if="!link"
    :type="type"
    @click="scrollToForm"
    :class="`relative btn ${size} text-center inline-flex items-center justify-center cursor-pointer text-[#faf3e9] uppercase bg-[#434848] focus:outline-none font-medium ${textSize} tracking-[1.15px] ${animate}`"
  >
    <span class="relative z-1 flex items-center">
      <svg
        v-if="icon"
        aria-hidden="true"
        role="status"
        class="w-4 h-4 me-2 text-white animate-spin"
        viewBox="0 0 100 101"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
          fill="#E5E7EB"
        />
        <path
          d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
          fill="currentColor"
        />
      </svg>
      {{ text }}</span
    >
  </button>
  <a
    v-else
    target="_blank"
    download
    :class="`relative btn ${size} text-center inline-flex items-center justify-center cursor-pointer text-[#faf3e9] uppercase bg-[#434848] hover:bg-[#000000] focus:outline-none font-small md:font-medium  ${textSize} tracking-[1.15px] ${animate}`"
  >
    <span class="relative z-1 flex items-center">
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
      {{ text }}</span
    >
  </a>
</template>

<script setup lang="ts">
import { gtmPush } from "../utils/gtm";
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

const colorBg = "#252828";

const animate =
  "hover:text-black transition-colors duration-300 before:content-[''] before:absolute before:left-0 before:bottom-0 before:w-full before:h-full before:bg-[#faf3e9] before:origin-bottom before:scale-y-0 before:transition-transform before:duration-300 hover:before:scale-y-100 before:z-0";

const sizes = {
  big2: "text-[.75rem] md:text-[.75rem]",
  big: "text-[.75rem] md:text-[.75rem]",
  small: "text-[.65rem] md:text-[.7rem]",
};

const textSize = computed(() => {
  return sizes[props.size];
});

const scrollToForm = () => {
  console.log('button_click_form')
  gtmPush({
    event: "GAEvent",
    event_params: {
      eventCategory: "button",
      eventAction: "click",
      eventLabel: "form",
      data: "button_click_form",
    },
  });

  if (props.type !== "submit") {
    document.getElementById("forma")?.scrollIntoView({ behavior: "smooth" });
  }
};

const downloadFiles = () => {
  console.log('button_click_download')
  gtmPush({
    event: "GAEvent",
    event_params: {
      eventCategory: "button",
      eventAction: "click",
      eventLabel: "form",
      data: "button_click_form",
    },
  });
};
</script>

<style scoped>
.btn.big2 {
  padding: 0.5rem 1.5rem;
}

.btn.big {
  padding: 0.5rem 0.75rem;
}

.btn.small {
  padding: 0.5rem 0.75rem;
  border: none;
}
</style>