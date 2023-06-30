import { redirect } from '@sveltejs/kit'

export const routerRedirect = (
  route: { id: string },
  defaultPath: string,
  requiredParts: string[]
) => {
  if (requiredParts.filter((part) => route.id.includes(part)).length === 0) {
    throw redirect(301, defaultPath)
  }
}
