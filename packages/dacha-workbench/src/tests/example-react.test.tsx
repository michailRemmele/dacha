import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

const Hello = ({ name } : { name?: string }): JSX.Element => {
  if (name) {
    return (
      <h1>
        {`Hello, ${name}!`}
      </h1>
    )
  }

  return <span>Hey, stranger</span>
}

describe('Example React -> Hello', () => {
  it('Renders without a name', () => {
    render(<Hello />)

    expect(screen.getByText('Hey, stranger')).toBeTruthy()
  })

  it('Renders with a name', () => {
    render(<Hello name="world" />)

    expect(screen.getByRole('heading')).toHaveTextContent('Hello, world!')
  })
})
