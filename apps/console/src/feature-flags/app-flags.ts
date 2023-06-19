import type { Flag } from './feature-flags'

const environment = {
  PROD: 'prod',
  DEV: 'dev'
}

export const appFlags = (env: keyof typeof environment): Readonly<Flag[]> =>
  [] as const
