import { formatWidgetName } from '../format-widget-name'

describe('Utils -> formatWidgetName()', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'electron', {
      writable: true,
      value: {
        getEditorConfig: () => ({ formatWidgetNames: true }),
      },
    })
  })

  it('Returns formatted name', () => {
    expect(formatWidgetName('example-name')).toBe('Example Name')
    expect(formatWidgetName('exampleName')).toBe('Example Name')
    expect(formatWidgetName('_exampleName')).toBe('Example Name')
    expect(formatWidgetName('example Name')).toBe('Example Name')
    expect(formatWidgetName('example name')).toBe('Example Name')
    expect(formatWidgetName('example long name')).toBe('Example Long Name')
    expect(formatWidgetName('example-long-name')).toBe('Example Long Name')
    expect(formatWidgetName('__example_long_name_')).toBe('Example Long Name')
    expect(formatWidgetName('example2D')).toBe('Example 2 D')
    expect(formatWidgetName('example212example')).toBe('Example 212 Example')
    expect(formatWidgetName('EXAMPLE')).toBe('EXAMPLE')
  })
})
