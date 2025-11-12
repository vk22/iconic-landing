<template>
  <section
    id="forma"
    ref="formSection"
    class="mx-auto w-full md:max-w-5xl flex flex-col py-20 transition-all duration-2000 mb-20"
    :class="{
      'opacity-100 translate-y-0': contentVisible,
      'opacity-90 translate-y-0': !contentVisible,
    }"
  >
    <div class="flex flex-col md:flex-row">
      <div class="basis-1/2 relative px-5 mb-5 md:mb-0">
        <img :src="image" alt="" class="object-cover h-full w-full" />
      </div>
      <div class="basis-1/2 pr-0">  
      <Form @form-sent="formAfterHandle" v-if="!isFormSent"></Form>
      </div>
    </div>
  </section>

    <!-- Popup Form -->
  <Teleport to="body">
    <transition name="fade">
      <div
        v-if="isFormSent"
        class="fixed inset-0 z-[999] flex flex justify-center items-center"
        @keydown.esc="closeForm"
        role="dialog"
        aria-modal="true"
      >
        <!-- backdrop -->
        <div class="absolute inset-0 bg-[#00000080]" @click="closeForm" />

        <!-- panel -->
        <transition name="slide">
            <div class="relative px-4 py-8 md:px-6 md:py-10 z-[9999] bg-white max-w-full md:max-w-md">
              <!--- close -->
              <button
                class="absolute right-0 -top-8 inline-flex items-center justify-center w-auto h-auto rounded focus:outline-none"
                aria-label="Close menu"
                @click="closeForm"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="w-6 h-6"
                  viewBox="0 0 20 20"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.5"
                >
                  <path
                    color="#ffffff"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
              <FormSuccess :mode="'popup'" :result="formResult" v-if="isFormSent"></FormSuccess>
            </div>
        </transition>
      </div>
    </transition>
  </Teleport>

</template>

<script setup lang="ts">
import { ref, onMounted, watch, onBeforeUnmount } from "vue";

const imageLoaded = ref(false);
const image = "/img/contact.jpg";
const contentVisible = ref(false);

const isFormOpen = ref(false);
const openForm = () => (isFormOpen.value = true);
const closeForm = () => {
  isFormOpen.value = false;
  isFormSent.value = false;
}

watch(isFormOpen, (open) => {
  const cls = document.documentElement.classList
  if (open) cls.add('overflow-hidden')
  else cls.remove('overflow-hidden')
})

const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') closeForm() }
onMounted(() => window.addEventListener('keydown', onKey))
onBeforeUnmount(() => window.removeEventListener('keydown', onKey))


const isFormSent = ref(false);

interface Result {
  success?: boolean;
  title?: string;
  message?: string;
}
const formResult = ref<Result>({});

const formAfterHandle = (result: object) => {
  isFormSent.value = true;
  formResult.value = result;
}

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
