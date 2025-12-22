export const useMobileMenu = () => {
  const isMenuOpen = useState<boolean>('isMenuOpen', () => false)

  ///
  const openMenu  = () => ( isMenuOpen.value = true )
  const closeMenu = () => ( isMenuOpen.value = false )

  return {
    // states
    isMenuOpen,
    // methods
    openMenu,
    closeMenu,
  }
}
