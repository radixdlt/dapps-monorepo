import Deploypackage from './DeployPackage.svelte'
import { render } from '@testing-library/svelte'
import userEvent from '@testing-library/user-event'

vi.mock('$env/static/public', () => ({
  PUBLIC_NETWORK_NAME: 'hammunet'
}))

describe('#deploy package', () => {
  it('Should upload both wasm and abi', async () => {
    const file = new File(['(⌐□_□)'], 'chucknorris.wasm', { type: 'wasm' })
    const file2 = new File(['(⌐□_□)'], 'chucknorris.abi', { type: 'abi' })
    const { container } = render(Deploypackage)
    const fileinput = container.querySelector(
      'input[name="fileupload"]'
    ) as HTMLInputElement

    await userEvent.upload(fileinput, [file, file2])
    // @ts-ignore
    expect(fileinput!.files[0].name).toStrictEqual(file.name)
    // @ts-ignore
    expect(fileinput.files!.item(0).name).toStrictEqual(file.name)
    // @ts-ignore
    expect(fileinput!.files[1].name).toStrictEqual(file2.name)
    // @ts-ignore
    expect(fileinput.files!.item(1).name).toStrictEqual(file2.name)
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
