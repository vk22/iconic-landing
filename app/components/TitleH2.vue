<template>
    <h3 :class="`text-[1.75rem] md:text-[1.75rem] mb-5 md:mb-5 uppercase text-${align}`">{{ text }}</h3>
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