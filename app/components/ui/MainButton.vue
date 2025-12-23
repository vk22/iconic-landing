<template>
  <component
    :is="tag"
    v-bind="attrs"
    :type="isButton ? props.type ?? 'button' : undefined"
    :href="isLink ? resolvedHref : undefined"
    :download="isDownload ? '' : undefined"
    :target="isLink ? '_blank' : undefined"
    :rel="isLink ? 'noopener noreferrer' : undefined"
    :class="[
      'relative btn text-center inline-flex items-center justify-center cursor-pointer text-[#faf3e9] uppercase bg-[#434848] focus:outline-none',
      isLink ? 'hover:bg-[#000000]' : '',
      isButton ? 'font-medium' : 'font-small md:font-medium',
      props.size,
      textSize,
      animate,
    ]"
    @click="handleClick"
  >
    <span class="relative z-1 flex items-center">
      <!-- spinner -->
      <svg
        v-if="
          props.icon &&
          (props.mode === 'scrollToForm' || props.mode === 'submitForm')
        "
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

      <!-- download icon -->
      <svg
        v-else-if="
          props.icon &&
          (props.mode === 'openForm' || props.mode === 'downloadFiles')
        "
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

      <slot><div class="flex flex-col md:flex-row"><span class="md:mr-1">{{ props.text ?? "Submit" }}</span> <span v-if="props.text2">{{ props.text2 ?? "" }}</span></div></slot>
    </span>
  </component>
</template>

<script setup lang="ts">
import { computed, useAttrs } from "vue";
// import { gtmPush } from "@/utils/gtm";
const { $gtmPush } = useNuxtApp()

defineOptions({ inheritAttrs: false });
const attrs = useAttrs();

const modes = [
  "scrollToForm",
  "openForm",
  "downloadFiles",
  "submitForm",
] as const;
type ButtonMode = (typeof modes)[number];

const props = withDefaults(
  defineProps<{
    text?: string;
    text2?: string;
    link?: string;
    type?: "button" | "submit" | "reset";
    size?: "small" | "big" | "large";
    icon?: boolean;
    mode: ButtonMode;
  }>(),
  {
    text: "Submit",
    text2: "",
    link: "",
    type: "button",
    size: "small",
    icon: false,
  }
);

const isButton = computed(
  () =>
    props.mode === "scrollToForm" ||
    props.mode === "submitForm" ||
    props.mode === "openForm"
);
const isLink = computed(() => !isButton.value);
const isDownload = computed(() => props.mode === "downloadFiles");

const tag = computed(() => (isButton.value ? "button" : "a"));
const resolvedHref = computed(() => (props.link ? props.link : undefined));

const animate =
  "hover:text-black transition-colors duration-300 before:content-[''] before:absolute before:left-0 before:bottom-0 before:w-full before:h-full before:bg-[#faf3e9] before:origin-bottom before:scale-y-0 before:transition-transform before:duration-300 hover:before:scale-y-100 before:z-0";

const sizes: Record<NonNullable<typeof props.size>, string> = {
  big: "text-[.75rem] md:text-[.75rem] py-[.5rem] px-[.75rem]",
  small: "text-[.65rem] md:text-[.7rem] py-[.45rem] px-[.5rem]",
  large: "text-[.85rem] md:text-[.9rem] py-[.65rem] px-[.85rem]",
};

const textSize = computed(() => sizes[props.size]);

function scrollToFormF() {
  document.getElementById("forma")?.scrollIntoView({ behavior: "smooth" });
}

function handleClick(e: MouseEvent) {
  if (props.mode === "scrollToForm") {
    scrollToFormF();
    console.log("button_click_download");
    $gtmPush({
      event: "GAEvent",
      event_params: {
        eventCategory: "button",
        eventAction: "click",
        eventLabel: "form",
        data: "button_click_form",
      },
    });
  } else if (props.mode === "downloadFiles") {
    console.log("button_click_download");
    $gtmPush({
      event: "GAEvent",
      event_params: {
        eventCategory: "button",
        eventAction: "click",
        eventLabel: "download",
        data: "button_click_download",
      },
    });
  } else if (props.mode === "openForm") {
    console.log("form_success_applicationdownload");
    $gtmPush({
      event: "GAEvent",
      event_params: {
        eventCategory: "button",
        eventAction: "click",
        eventLabel: "applicationdownload",
        data: "form_success_applicationdownload",
      },
    });
  }

  if (isButton.value) {
    return;
  }

  // Без href ссылка не имеет смысла — можно отменять клик, чтобы не было перехода на текущую страницу
  if (!resolvedHref.value) {
    console.log("preventDefault ");
    e.preventDefault();
  }
}
</script>

<style scoped>

</style>
