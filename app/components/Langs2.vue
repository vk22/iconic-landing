<script setup>
const { locale, locales } = useI18n()
const switchLocalePath = useSwitchLocalePath()
const router = useRouter()

// Лейбл, который показываем пользователю (держим старый до завершения навигации)
const displayedLocale = ref(locale.value)
const isSwitching = ref(false)

const current = computed(() => locales.value.find(l => l.code === displayedLocale.value))
const others = computed(() => locales.value.filter(l => l.code !== locale.value))

// Если язык поменялся «извне», а мы не в процессе переключения — синхронизируем
watch(locale, (val) => {
  if (!isSwitching.value) displayedLocale.value = val
})

// Навигация с задержкой обновления лейбла до готовности контента
async function switchTo(code) {
  if (!code || code === locale.value) return
  isSwitching.value = true

  // генерим целевой путь под текущий роут (с заменой префикса языка)
  const to = switchLocalePath(code)

  // навигация (SSR-friendly). Пока не завершится — показываем старый лейбл
  await router.push(to)

  // контент отрендерился — теперь можно обновить лейбл
  displayedLocale.value = code
  isSwitching.value = false
}
</script>

<template>
  <div class="relative inline-block group select-none">
    <!-- Активный язык (показываем displayedLocale, а не locale) -->
    <div class="px-2 py-1 font-medium uppercase tracking-wide text-sm flex items-center gap-1">
      <span>{{ current?.code }}</span>
      <!-- Индикатор во время переключения (опционально) -->
      <svg
        v-if="isSwitching"
        class="animate-spin h-3.5 w-3.5 opacity-70"
        viewBox="0 0 24 24" fill="none" stroke="currentColor"
      >
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke-width="3"></circle>
        <path class="opacity-75" d="M4 12a8 8 0 0 1 8-8" stroke-width="3" stroke-linecap="round"></path>
      </svg>
    </div>

    <!-- Меню остальных языков — всплывает СЛЕВА -->
    <div
      class="absolute left-0 -translate-x-full top-1/2 -translate-y-1/2
             invisible opacity-0 group-hover:visible group-hover:opacity-100
             transition-all duration-150 -translate-x-2 group-hover:translate-x-0
             flex flex-col gap-1 bg-white/95 backdrop-blur border border-black/10
             rounded-md shadow-lg px-2 py-2"
    >
      <button
        v-for="l in others"
        :key="l.code"
        type="button"
        @click.prevent="switchTo(l.code)"
        class="px-2 py-1 text-sm uppercase tracking-wide rounded text-gray-800 hover:bg-black/5 text-start"
      >
        {{ l.code }}
      </button>
    </div>
  </div>
</template>
