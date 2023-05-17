import type { PrismaClient } from '@prisma/client'
import { mockDeep, type DeepMockProxy } from 'vitest-mock-extended'
import type { GatewayService } from '../auth/gateway'

export type Context = {
  prisma: PrismaClient
  gatewayService: GatewayService
}

export type MockContext = {
  prisma: DeepMockProxy<PrismaClient>
  gatewayService: DeepMockProxy<GatewayService>
}

export const createMockContext = (): MockContext => {
  return {
    prisma: mockDeep<PrismaClient>(),
    gatewayService: mockDeep<GatewayService>()
  }
}
