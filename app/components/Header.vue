<template>
  <header class="header flex flex-row justify-between items-center p-3 pl-6 transition-all duration-1000"
  :class="{
    'opacity-100 translate-y-0': contentVisible,
    'opacity-0 -translate-y-4': !contentVisible
  }">
      <div class="logo">
          <img class="w-[6rem]" src="../assets/img/mered2.svg" alt="" />
      </div>
      <div class="btn">
        <Button :type="'button'" :text="'Leave a Request'"></Button>
      </div>
  </header>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
const contentVisible = ref(false);

onMounted(() => {
  setTimeout(() => (contentVisible.value = true), 400)
})

</script>

<style scoped>
.header {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  background: rgba(0, 0, 0, 0.313);
  backdrop-filter: blur(.5rem) brightness(.8);
  z-index: 99;
}

</style>
