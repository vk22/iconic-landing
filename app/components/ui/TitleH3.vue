<template>
    <h3 :class="`text-[1.25rem] md:text-[2.25rem] mb-6 md:mb-6 uppercase text-${align}`">{{ text }}</h3>
</template>

<script setup lang="ts">
const props = defineProps({
  text: {
    type: String,
    default: "Title",
  },
  align: {
    type: String,
    default: "center",
  },
});

import { ref, computed } from "vue";
const formSection = ref(null);


</script>

<style scoped>

</style>