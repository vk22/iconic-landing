<template>
    <h3 :class="`text-[1.15rem] md:text-[1.25rem] mb-2 md:mb-3 uppercase text-${align}`">{{ text }}</h3>
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