export const convertOlympiaToBabylonAddress = (olympiaAddress: string) => {
  return fetch('api/ret/convert-olympia-address', {
    method: 'POST',
    body: JSON.stringify({
      olympiaAddress
    })
  })
    .then((res) => res.json())
    .then((res) => res.babylonAddress)
}
