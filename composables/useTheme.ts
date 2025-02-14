export const useTheme = createGlobalState(() => {
  const isDark = useDark()

  /**
   * Credit to [@hooray](https://github.com/hooray)
   * @see https://github.com/vuejs/vitepress/pull/2347
   */
  function toggleDark(event: MouseEvent) {
    const isAppearanceTransition = ('startViewTransition' in document)
      && !window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (!isAppearanceTransition) {
      isDark.value = !isDark.value
      return
    }

    const x = event.clientX
    const y = event.clientY
    const endRadius = Math.hypot(
      Math.max(x, innerWidth - x),
      Math.max(y, innerHeight - y),
    )
    const transition = document.startViewTransition!(async () => {
      isDark.value = !isDark.value
      await nextTick()
    })
    transition.ready
      .then(() => {
        const clipPath = [
          `circle(0px at ${x}px ${y}px)`,
          `circle(${endRadius}px at ${x}px ${y}px)`,
        ]
        document.documentElement.animate(
          {
            clipPath: isDark.value
              ? [...clipPath].reverse()
              : clipPath,
          },
          {
            duration: 300,
            easing: 'ease-out',
            pseudoElement: isDark.value
              ? '::view-transition-old(root)'
              : '::view-transition-new(root)',
          },
        )
      })
  }

  return {
    isDark,
    toggleDark,
  }
})
