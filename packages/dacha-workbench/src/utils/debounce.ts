type FnType<T extends Array<unknown>> = (...args: T) => void

export const debounce = <T extends Array<unknown>>(
  fn: FnType<T>,
  time: number,
): FnType<T> => {
  let timeoutId: NodeJS.Timeout

  return (...args) => {
    clearTimeout(timeoutId)

    timeoutId = setTimeout(() => fn(...args), time)
  }
}
