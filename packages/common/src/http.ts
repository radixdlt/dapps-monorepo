export const http = {
  get: (url: string) => fetch(url, { method: 'GET' }).then((res) => res.json()),
  post: (url: string, body: any) =>
    fetch(url, {
      method: 'POST',
      body: JSON.stringify(body)
    }).then((res) => res.json())
}
