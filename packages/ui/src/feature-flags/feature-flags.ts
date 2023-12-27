import { appFlags } from './app-flags'
import { PUBLIC_APP_ENV } from '$env/static/public'

export type Flag = {
  id: string
  description: string
  enabled: boolean
}

const getFlagsFromAppEnvironment = () =>
({
  development: appFlags('DEV'),
  production: appFlags('PROD')
}[PUBLIC_APP_ENV]!)

const flags = getFlagsFromAppEnvironment()

type ListType<T> = T extends Readonly<Flag[]> ? T : typeof flags

const featureFlags = <T>(list = flags as ListType<T>) => ({
  get: () => list,
  getFlag: (id: (typeof list)[number]['id']) => list.find((f) => f.id === id)
})

export default featureFlags
