import Deploypackage from './DeployPackage.svelte'
import { render } from '@testing-library/svelte'
import userEvent from '@testing-library/user-event'

vi.mock('$app/navigation', () => ({}))

describe.skip('#deploy package', () => {
  it('Should upload file', async () => {
    const file = new File(['(⌐□_□)'], 'chucknorris.wasm', { type: 'wasm' })
    const { container } = render(Deploypackage)
    const fileinput = container.querySelector(
      'input[name="fileupload"]'
    ) as HTMLInputElement

    await userEvent.upload(fileinput, [file])
    // @ts-ignore
    expect(fileinput!.files[0].name).toStrictEqual(file.name)
    // @ts-ignore
    expect(fileinput.files!.item(0).name).toStrictEqual(file.name)
  })

  it('Should not upload img file', async () => {
    const file = new File(['(⌐□_□)'], 'chucknorris.jpeg', { type: 'jpeg' })
    const { container } = render(Deploypackage)
    const fileinput = container.querySelector(
      'input[name="fileupload"]'
    ) as HTMLInputElement

    await userEvent.upload(fileinput, file)
    expect(fileinput!.files).toHaveLength(0)
  })
})
