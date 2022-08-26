import { render, screen } from '@testing-library/svelte'
import userEvent from '@testing-library/user-event'
import Explorer from './+layout.svelte'
import { vi } from 'vitest'
import { goto } from '$app/navigation'

beforeAll(() => {
  vi.resetModules()
  vi.resetAllMocks()
  vi.mock('$app/navigation', () => {
    return { goto: vi.fn() }
  })
})

describe('#explorer layout', () => {
  it('Should make sure that input with placeholder exists', () => {
    render(Explorer)
    const div = screen.getByPlaceholderText('Enter Transaction ID')
    expect(div).to.exist
  })

  it('Should make sure typing transaction works and that it sends the id to next page', async () => {
    render(Explorer)
    const input: HTMLInputElement = screen.getByPlaceholderText(
      'Enter Transaction ID'
    )
    await userEvent.type(input, 'test')
    const button = screen.getByText('Search')
    await userEvent.click(button)

    expect(goto).toBeCalledWith('/explorer/transaction/test')
  })
})
