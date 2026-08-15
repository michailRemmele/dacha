import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

import { Icon } from '..'

describe('Icon', () => {
  it('renders the provided icon element', () => {
    render(<Icon icon={<svg data-testid="glyph" />} />)
    expect(screen.getByTestId('glyph')).toBeInTheDocument()
  })

  it('forwards className to its container', () => {
    const { container } = render(
      <Icon className="custom" icon={<svg data-testid="glyph" />} />,
    )
    expect(container.querySelector('.custom')).not.toBeNull()
    expect(container.querySelector('.custom')?.contains(screen.getByTestId('glyph'))).toBe(true)
  })
})
