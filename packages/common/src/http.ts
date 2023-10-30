export const downloadBinaryFile = (url: string, filename: string) =>
  fetch(url, { method: 'GET' })
    .then((res) =>
      res.status === 200
        ? res
        : res.json().then((err) => {
            throw err
          })
    )
    .then((response) => response.blob())
    .then((blob) => URL.createObjectURL(blob))
    .then((url) => {
      const element = document.createElement('a')

      element.href = url
      element.setAttribute('download', filename)

      document.body.appendChild(element)
      element.click()
      document.body.removeChild(element)
      URL.revokeObjectURL(url)
    })

export const http = {
  get: (url: string) => fetch(url, { method: 'GET' }).then((res) => res.json()),
  post: (url: string, body: any) =>
    fetch(url, {
      method: 'POST',
      body: JSON.stringify(body)
    }).then((res) => res.json())
}
