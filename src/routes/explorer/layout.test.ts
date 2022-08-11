import { render, screen } from '@testing-library/svelte'
import Explorer from './__layout.svelte'

describe('#explorer layout', () => {
  it.only('Should ', () => {
    render(Explorer)
    const div = screen.getByText('test')
    console.log(div)
  })
})
