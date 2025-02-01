export const isScrolledIntoView = (element: HTMLElement, container: HTMLElement): boolean => {
  const elementRect = element.getBoundingClientRect()
  const elementTop = elementRect.top
  const elementBottom = elementRect.bottom

  const containerRect = container.getBoundingClientRect()
  const containerTop = containerRect.top
  const containerBottom = containerRect.bottom

  return elementTop >= containerTop && elementBottom <= containerBottom
}
