<template>
  <section
    id="forma"
    ref="formSection"
    class="mx-auto w-full md:max-w-5xl flex flex-col py-20 transition-all duration-2000 mb-0"
    :class="{
      'opacity-100 translate-y-0': contentVisible,
      'opacity-90 translate-y-0': !contentVisible,
    }"
  >
    <div class="flex flex-col md:flex-row">
      <div class="basis-1/2 relative px-5 mb-5 md:mb-0">
        <img :src="image" alt="" class="object-cover h-full w-full" />
      </div>
      <div class="basis-1/2 px-2">  
        <Form @form-sent="formAfterHandle"></Form>
      </div>
    </div>
  </section>


</template>

<script setup lang="ts">
import { ref, onMounted, watch, onBeforeUnmount } from "vue";

const emit = defineEmits(['popupOpen']);

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
    emit('popupOpen', result);
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
