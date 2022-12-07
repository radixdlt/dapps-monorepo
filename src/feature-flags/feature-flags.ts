import { devAppFlags, prodAppFlags } from './app-flags'
import { PUBLIC_APP_ENV } from '$env/static/public'

type TFeatureFlag = {
  id: string
  description: string
  enabled: boolean
}

const getFlagsFromAppEnvironment = () => {
  switch (PUBLIC_APP_ENV) {
    case 'development':
      return devAppFlags
    default:
      return prodAppFlags
  }
}

const appFlags = getFlagsFromAppEnvironment()

type ListType<T> = T extends Readonly<TFeatureFlag[]> ? T : typeof appFlags

const featureFlags = <T>(list = appFlags as ListType<T>) => ({
  get: () => list,
  getFlag: (id: typeof list[number]['id']) => list.find((f) => f.id === id)
})

export default featureFlags
