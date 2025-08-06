type FnType<T extends unknown[]> = (...args: T) => void

export const debounce = <T extends unknown[]>(
  fn: FnType<T>,
  time: number,
): FnType<T> => {
  let timeoutId: NodeJS.Timeout

  return (...args) => {
    clearTimeout(timeoutId)

    timeoutId = setTimeout(() => fn(...args), time)
  }
}
