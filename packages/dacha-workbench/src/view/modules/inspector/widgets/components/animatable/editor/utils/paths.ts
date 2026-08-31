const findPathByName = (path: string[], name: string): string[] | undefined => {
  let lastIndex = 0
  for (let i = path.length - 1; i >= 0; i -= 1) {
    if (path[i] === name) {
      lastIndex += 1
      break
    }
    lastIndex -= 1
  }

  if (Math.abs(lastIndex) === path.length) {
    return undefined
  }

  return lastIndex < 0 ? path.slice(0, lastIndex) : path
}

export const getStatePath = (path: string[]): string[] | undefined => findPathByName(path, 'states')
export const getSubstatePath = (path: string[]): string[] | undefined => findPathByName(path, 'substates')
