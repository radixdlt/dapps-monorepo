export function hideHeader(node: HTMLElement) {
  let throttlePause: boolean = false
  let lastScrollTop = 0
  const throttle = (callback: () => void, time: number) => {
    if (throttlePause) return
    //set throttlePause to true after the if condition. This allows the function to be run once
    throttlePause = true

    //setTimeout runs the callback within the specified time
    setTimeout(() => {
      callback()

      //throttlePause is set to false once the function has been called, allowing the throttle function to loop
      throttlePause = false
    }, time)
  }
  const handleScroll = (event: Event) => {
    throttle(() => {
      const { scrollTop } = event.target as Element
      if (scrollTop > lastScrollTop) {
        node.classList.add('collapsed')
        lastScrollTop = scrollTop
      } else if (scrollTop === 0 || lastScrollTop - 400 > scrollTop) {
        lastScrollTop = scrollTop
        node.classList.remove('collapsed')
      }
    }, 300)
  }

  node.classList.remove('collapsed')

  document.addEventListener('scroll', handleScroll, true)
  return {
    destroy() {
      document.removeEventListener('scroll', handleScroll, true)
    }
  }
}
