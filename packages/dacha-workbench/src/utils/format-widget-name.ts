export const formatWidgetName = (name: string): string => {
  const { formatWidgetNames } = window.electron.getEditorConfig()

  if (!formatWidgetNames) {
    return name
  }

  return name
    .replace(/[_-]+/g, ' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/^./, (s) => s.toUpperCase())
    .replace(/ (\w)/g, (_, s: string) => ` ${s.toUpperCase()}`)
}
