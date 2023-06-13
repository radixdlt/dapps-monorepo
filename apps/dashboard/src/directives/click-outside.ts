export function clickOutside(node: HTMLElement) {
  const handleClick = (event: Event) => {
    if (
      node &&
      event.target &&
      event.target instanceof Element &&
      !node.contains(event.target) &&
      !event.defaultPrevented
    ) {
      node.dispatchEvent(new CustomEvent('outside-click'))
    }
  }
  document.addEventListener('click', handleClick, true)
  return {
    destroy() {
      document.removeEventListener('click', handleClick, true)
    }
  }
}
