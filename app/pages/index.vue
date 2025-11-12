<template>
  <Popup ></Popup>
  <Header></Header>
  <div class="landing-index transition-opacity duration-1000"  :class="{ 'opacity-100': imageLoaded, 'opacity-0': !imageLoaded }">
  <Hero></Hero>  
  <Overview2></Overview2>
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
const backgroundUrl = '/img/1.jpg' ;
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
.landing-index {
  min-height: 100vh;
  position: relative;
  /* background-image: linear-gradient(rgba(0, 0, 0, 0.527),rgba(0, 0, 0, 0.5)), url("/img/1.jpg");
  background-position: center center;
  background-size: cover; */
}


</style>