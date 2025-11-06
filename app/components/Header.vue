<template>
  <header
    class="header flex flex-row justify-between items-center px-6 py-4 transition-all duration-1000"
    :class="{
      'opacity-100 translate-y-0': contentVisible,
      'opacity-0 -translate-y-4': !contentVisible,
    }"
  >
    <div class="w-[10rem]">
      <Langs></Langs>
    </div>
    
    <div class="logo">
      <img class="w-[6rem]" src="../assets/img/mered2.svg" alt="" />
    </div>

    <div class="btn ml-3 w-[10rem] text-right">
      <Button :type="'button'" :text="'Leave a Request'"></Button>
    </div>

  </header>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
const { locale, locales, setLocale } = useI18n();
const switchLocalePath = useSwitchLocalePath();
const contentVisible = ref(false);

const current = computed(() => locales.value.find(l => l.code === locale.value))
const others = computed(() => locales.value.filter(l => l.code !== locale.value))

onMounted(() => {
  setTimeout(() => (contentVisible.value = true), 400);
});
</script>

<style scoped>
.header {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  background: rgba(0, 0, 0, 0.313);
  backdrop-filter: blur(0.5rem) brightness(0.8);
  z-index: 99;
}

.lang-switcher {
  position: relative;
  display: inline-block;
  cursor: pointer;
  user-select: none;
  font-weight: 500;
}

/* активный язык */
.current {
  padding: 6px 10px;
}

/* скрытое меню */
.menu {
  position: absolute;
  top: 100%;
  left: 0;
  background: white;
  border-radius: 6px;
  padding: 6px 0;
  opacity: 0;
  pointer-events: none;
  transform: translateY(4px);
  transition: all 0.2s ease;
  box-shadow: 0 8px 18px rgba(0,0,0,0.08);
}

/* показываем при наведении */
.lang-switcher:hover .menu {
  opacity: 1;
  pointer-events: auto;
  transform: translateY(0);
}

/* пункты */
.option {
  display: block;
  padding: 6px 14px;
  white-space: nowrap;
  font-size: 14px;
  color: #333;
}

.option:hover {
  background: #f4f4f4;
}
</style>
