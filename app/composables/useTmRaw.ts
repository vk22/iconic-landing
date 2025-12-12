import { useI18n } from 'vue-i18n'

export function useTmRaw<T = any>(key: string): T {
  const { tm } = useI18n()

  const data = tm(key)

  function unwrap(v: any) {
    // Строка в продакшене
    if (typeof v === 'string') return v

    // AST в деве
    if (v?.loc?.source) return v.loc.source

    // Объект с полями
    if (typeof v === 'object') {
      const out: any = {}
      for (const k in v) out[k] = unwrap(v[k])
      return out
    }

    return v
  }

  if (Array.isArray(data)) {
    return data.map(item => unwrap(item)) as T
  }

  return unwrap(data) as T
}
