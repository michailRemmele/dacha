export const parseTemplatePath = (path: string[]): string[] => path.reduce((acc, value, index) => {
  acc.push(`id:${value}`)
  if (index !== path.length - 1) {
    acc.push('children')
  }
  return acc
}, ['templates'])
