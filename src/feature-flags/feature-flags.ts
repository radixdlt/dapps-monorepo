import { appFlags } from './app-flags'
import { PUBLIC_APP_ENV } from '$env/static/public'

type TFeatureFlag = {
  id: string
  description: string
  enabled: boolean
}

const getFlagsFromAppEnvironment = () => {
  switch (PUBLIC_APP_ENV) {
    case 'development':
      return appFlags('PROD')
    default:
      return appFlags('DEV')
  }
}

const flags = getFlagsFromAppEnvironment()

type ListType<T> = T extends Readonly<TFeatureFlag[]> ? T : typeof flags

const featureFlags = <T>(list = flags as ListType<T>) => ({
  get: () => list,
  getFlag: (id: typeof list[number]['id']) => list.find((f) => f.id === id)
})

export default featureFlags
