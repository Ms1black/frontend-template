import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useCounterStore } from '../model/counterStore'
import { Counter } from './Counter'

beforeEach(() => {
  useCounterStore.setState({ count: 0 })
})

describe('Counter', () => {
  it('renders initial count', () => {
    render(<Counter />)
    expect(screen.getByText('0')).toBeInTheDocument()
  })

  it('increments on + click', async () => {
    render(<Counter />)
    await userEvent.click(screen.getByRole('button', { name: '+' }))
    expect(screen.getByText('1')).toBeInTheDocument()
  })

  it('decrements on − click', async () => {
    render(<Counter />)
    await userEvent.click(screen.getByRole('button', { name: '−' }))
    expect(screen.getByText('-1')).toBeInTheDocument()
  })

  it('resets to 0', async () => {
    render(<Counter />)
    await userEvent.click(screen.getByRole('button', { name: '+' }))
    await userEvent.click(screen.getByRole('button', { name: '+' }))
    await userEvent.click(screen.getByRole('button', { name: 'Reset' }))
    expect(screen.getByText('0')).toBeInTheDocument()
  })
})
