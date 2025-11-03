<script setup>
const { locale, locales } = useI18n()
const switchLocalePath = useSwitchLocalePath()

const current = computed(() => locales.value.find(l => l.code === locale.value))
const others = computed(() => locales.value.filter(l => l.code !== locale.value))
</script>

<template>
  <div class="relative inline-block group select-none cursor-pointer mt-[.1rem]">
    <!-- Активный язык -->
    <div class="px-1 py-1 font-medium uppercase tracking-wide text-[.65rem] text-white">
      {{ current.code }}
    </div>

    <!-- Меню остальных языков -->
    <div
      class="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-[80%]
             flex flex-col gap-1 py-1
             opacity-0 pointer-events-none
             transition-all duration-300 ease-out
             group-hover:opacity-100 group-hover:pointer-events-auto group-hover:-translate-x-[100%]"
    >
      <NuxtLink
        v-for="l in others"
        :key="l.code"
        :to="switchLocalePath(l.code)"
        class="px-2 py-1 text-[.7rem] uppercase tracking-wide text-[#ddd] hover:text-[#ffffff] transition-all"
      >
        {{ l.code }}
      </NuxtLink>
    </div>
  </div>
</template>
