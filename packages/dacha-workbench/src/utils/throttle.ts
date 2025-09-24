type FnType<T extends unknown[]> = (...args: T) => void

export const throttle = <T extends unknown[]>(fn: FnType<T>, ms: number): FnType<T> => {
  let isTimeout = false
  let stashedArgs: T | undefined

  const throttledFn = (...args: T): void => {
    if (!isTimeout) {
      fn(...args)
      isTimeout = true

      setTimeout(() => {
        isTimeout = false
        if (stashedArgs !== undefined) {
          throttledFn(...stashedArgs)
          stashedArgs = undefined
        }
      }, ms)
    } else {
      stashedArgs = args
    }
  }

  return throttledFn
}
