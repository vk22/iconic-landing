<template>
  <Popup ></Popup>
  <Header></Header>
  <div class="landing-index relative min-h-[100vh] transition-opacity duration-1000"  :class="{ 'opacity-100': imageLoaded, 'opacity-0': !imageLoaded }">
  <Hero></Hero>  
  <Overview></Overview>
  <Gallery></Gallery>
  <Location></Location>
  <Payment></Payment>
  <FormBlock></FormBlock>
  <Footer></Footer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
const imageLoaded = ref(false);
const backgroundUrl = '/img/top-1.jpg' ;
const contentVisible = ref(false);

onMounted(() => {
  const img = new Image();
  img.src = backgroundUrl;
  img.onload = () => {
    imageLoaded.value = true;
    setTimeout(() => (contentVisible.value = true), 300)
  }
})
</script>

<style scoped>


</style>