<template>
  <div class="relative inline-block group select-none cursor-pointer mx-2 mt-[.1rem]">
    <!-- Активный язык -->
    <div class="px-1 py-1 font-medium uppercase tracking-wide text-[.65rem] text-white">
      {{ current.code }}
    </div>

    <!-- Меню остальных языков -->

    <div
      class="absolute top-[.7rem] -translate-y-1/2 
             flex flex-row gap-1 py-1
             opacity-0 pointer-events-none
             transition-all duration-300 ease-out text-[.65rem]
             group-hover:opacity-100 group-hover:pointer-events-auto px-1"
      :class="menuPositionClasses"       
    >
      <NuxtLink
        v-for="l in others"
        :key="l.code"
        :to="switchLocalePath(l.code)"
        class="px-1 py-1 text-[.7rem] uppercase tracking-wide text-[#ddd] hover:text-[#ffffff] transition-all"
      >
        {{ l.code }}
      </NuxtLink>
    </div>
  </div>
</template>

<script setup>
  const { locale, locales } = useI18n()
  const switchLocalePath = useSwitchLocalePath()

  const current = computed(() => locales.value.find(l => l.code === locale.value))
  const others = computed(() => locales.value.filter(l => l.code !== locale.value))
  const isRtl = computed(() => locale.value === 'ar');
  const menuPositionClasses = computed(() =>
    isRtl.value
      ? // RTL → вправо
        'right-0 translate-x-[80%] group-hover:translate-x-[100%]'
      : // LTR → влево
        'left-0 -translate-x-[80%] group-hover:-translate-x-[100%]'
  )
</script>
