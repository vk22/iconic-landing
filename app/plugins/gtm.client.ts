export default defineNuxtPlugin(() => {
  // Ensure dataLayer exists (GTM usually creates it, but we guard anyway)
  ;(window as any).dataLayer = (window as any).dataLayer || []

  const gtmPush = (payload: Record<string, any>) => {
    ;(window as any).dataLayer.push(payload)
  }

  return {
    provide: { gtmPush }
  }
})
