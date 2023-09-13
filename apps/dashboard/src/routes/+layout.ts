import { PUBLIC_APP_ENV } from "$env/static/public"

export const prerender = true

export const ssr = PUBLIC_APP_ENV === 'production'