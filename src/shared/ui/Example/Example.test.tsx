import { render, screen } from '@testing-library/react'
import { Example } from './Example'

describe('Example', () => {
  it('renders label', () => {
    render(<Example label="Hello" />)
    expect(screen.getByTestId('example')).toHaveTextContent('Hello')
  })

  it('renders badge when provided', () => {
    render(<Example label="Hello" badge="New" />)
    expect(screen.getByText('New')).toBeInTheDocument()
  })

  it('does not render badge when not provided', () => {
    render(<Example label="Hello" />)
    expect(screen.queryByText('New')).not.toBeInTheDocument()
  })
})
