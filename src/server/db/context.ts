import type { PrismaClient } from '@prisma/client'
import { mockDeep, type DeepMockProxy } from 'vitest-mock-extended'
import type { GatewayService } from '../auth/gateway'
import type { Cookies } from '@sveltejs/kit'

export type Context = {
  prisma: PrismaClient
  gatewayService: GatewayService
  cookies: Cookies
}

export type MockContext = {
  prisma: DeepMockProxy<PrismaClient>
  gatewayService: DeepMockProxy<GatewayService>
  cookies: DeepMockProxy<Cookies>
}

export const createMockContext = (): MockContext => {
  return {
    prisma: mockDeep<PrismaClient>(),
    gatewayService: mockDeep<GatewayService>(),
    cookies: mockDeep<Cookies>()
  }
}
