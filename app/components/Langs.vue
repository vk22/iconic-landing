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
        @click="closeMenu"
      >
        {{ l.code }}
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useSwitchLocalePath } from '#i18n'
import { useMobileMenu } from "../composables/useMobileMenu";
const {
  closeMenu,
} = useMobileMenu();

const route = useRoute()
const { locales } = useI18n()
const switchLocalePath = useSwitchLocalePath()

// 🔑 текущий язык ТОЛЬКО из URL
const routeLocale = computed(() => {
  const firstSegment = route.path.split('/')[1]
  const known = locales.value.map(l => l.code)
  return known.includes(firstSegment) ? firstSegment : 'en'
})

const current = computed(() =>
  locales.value.find(l => l.code === routeLocale.value)
)

const others = computed(() =>
  locales.value.filter(l => l.code !== routeLocale.value)
)

const isRtl = computed(() => routeLocale.value === 'ar')

const menuPositionClasses = computed(() =>
  isRtl.value
    ? 'right-0 translate-x-[80%] group-hover:translate-x-[100%]'
    : 'left-0 -translate-x-[80%] group-hover:-translate-x-[100%]'
)
</script>
