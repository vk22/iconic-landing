<template>
  <transition name="fade">
    <div
      v-if="isPopupOpen"
      class="fixed inset-0 z-[999] flex flex justify-center items-center h-xs:items-start"
      @keydown.esc="closePopup"
      role="dialog"
      aria-modal="true"
    >
      <!-- backdrop -->
      <div class="absolute inset-0 bg-[#00000080]" @click="closePopup" />

      <!-- panel -->
      <transition name="slide">
        <div
          class="relative px-3 md:px-4 py-6 md:py-8 z-[9999] mt-4 mx-4 bg-white max-w-full md:max-w-md max-h-[85vh] overflow-scroll transition-all duration-500"
          :class="{
            'opacity-100 translate-y-0': isPopupContentShow,
            'opacity-0 -translate-y-10': !isPopupContentShow,
          }"
        >
          <!--- close -->
          <button
            class="absolute top-3 right-3 inline-flex items-center justify-center w-auto h-auto rounded focus:outline-none"
            aria-label="Close menu"
            @click="closePopup"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-4 h-4"
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              stroke-width="1.5"
            >
              <path
                color="#111"
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
          <transition name="fade-form">
            <Form :mode="'popup'" v-if="isFormOpen"></Form>
          </transition>
          <transition name="fade-success">
            <FormSuccess
              :mode="'popup'"
              :result="formResult"
              v-if="isSuccessOpen"
            ></FormSuccess>
          </transition>
        </div>
      </transition>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, onBeforeUnmount } from "vue";
import { usePopup } from "../composables/usePopup";
const {
  isPopupOpen,
  isPopupContentShow,
  isFormOpen,
  isSuccessOpen,
  setPopupMode,
  setFormMode,
  setSuccessMode,
  setResult,
  formResult,
} = usePopup();

watch(isPopupOpen, (open) => {
  console.log("323");
  const cls = document.documentElement.classList;
  if (open) cls.add("overflow-hidden");
  else cls.remove("overflow-hidden");
});

const onKey = (e: KeyboardEvent) => {
  if (e.key === "Escape") setPopupMode(false);
};
onMounted(() => window.addEventListener("keydown", onKey));
onBeforeUnmount(() => window.removeEventListener("keydown", onKey));

const closePopup = () => {
  setPopupMode(false);
  setFormMode(false);
  setSuccessMode(false);
};

///
</script>

<style scoped>
/* transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-form-enter-active,
.fade-form-leave-active {
  transition: opacity 0.5s ease;
}
.fade-form-enter-from,
.fade-form-leave-to {
  opacity: 0;
}

.fade-success-enter-active,
.fade-success-leave-active {
  transition: opacity 0.5s ease 2s;
}
.fade-success-enter-from,
.fade-success-leave-to {
  opacity: 0;
}

.slide-enter-active,
.slide-leave-active {
  transition: transform 0.5s ease 1s;
}
.slide-enter-from,
.slide-leave-to {
  transform: translateY(-100%);
}
</style>