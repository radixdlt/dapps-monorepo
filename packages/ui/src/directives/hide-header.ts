export function hideHeader(node: HTMLElement) {
  let lastScrollTop = 0

  const handleScroll = (event: Event) => {
    const { scrollTop } = event.target as Element
    if (scrollTop === 0 || scrollTop <= 150) {
      lastScrollTop = 0
      node.classList.remove('collapsed')
      return
    }

    if (scrollTop > lastScrollTop) {
      if (scrollTop <= 500) {
        return
      }
      node.classList.add('collapsed')
      lastScrollTop = scrollTop
    } else if (scrollTop === 0 || lastScrollTop - 400 > scrollTop) {
      lastScrollTop = scrollTop
      node.classList.remove('collapsed')
    }
  }

  node.classList.remove('collapsed')

  document.addEventListener('scroll', handleScroll, true)
  return {
    destroy() {
      document.removeEventListener('scroll', handleScroll, true)
    }
  }
}
