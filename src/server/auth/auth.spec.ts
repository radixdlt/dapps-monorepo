import { okAsync } from 'neverthrow'
import { appLogger } from '../helpers/logger'
import { AuthController } from './controller'
import { AuthModel } from './model'
import {
  type MockContext,
  type Context,
  createMockContext
} from '../db/context'
import type { SignedChallenge } from '@radixdlt/radix-dapp-toolkit'

let mockCtx: MockContext
let ctx: Context
let controller: AuthController

describe('AuthController', () => {
  beforeEach(() => {
    mockCtx = createMockContext()
    ctx = mockCtx as unknown as Context

    controller = AuthController({
      logger: appLogger,
      authModel: AuthModel(ctx.prisma),
      gatewayService: ctx.gatewayService,
      expectedOrigin:
        'https://radix-dapp-toolkit-dev.rdx-works-main.extratools.works',
      dAppDefinitionAddress:
        'account_tdx_c_1pyzqdjf32fg7et45y700pl7vhfrmdpss2sn6rdr4nkgskc4tw8',
      networkId: 12
    })
  })

  it('should create a challenge', async () => {
    mockCtx.prisma.challenge.create.mockResolvedValue(
      Promise.resolve({ challenge: 'deedbeef' }) as any
    )

    const result = await controller.createChallenge()

    if (result.isErr()) throw result.error

    const { data, httpResponseCode } = result.value

    expect(data.challenge).toBeDefined()
    expect(httpResponseCode).toBe(201)
  })
  it('should successfully verify a valid challenge', async () => {
    const signedChallenge: SignedChallenge = {
      address:
        'identity_tdx_c_1pnp5sss27cp86h4n0c7y76r5xk7fxhpvmczy5zvvw7nqnkct7f',
      type: 'persona',
      proof: {
        publicKey:
          '40a0ae91901259b374a5ec9b618718a23ecd910fa2eb39ecc858f6e627d9734c',
        signature:
          'a9c8a1a9c6ad79913f833d0013c33bc03b8b4cf77f171d9f63d62b0ff0f5711b6fbac4845270782c74956602ed25f322318c4b6160745f32a4d9521f01acc402',
        curve: 'curve25519'
      },
      challenge:
        '15fd9109de8e811054b4b99e1e65fc901d5ce6213b0944176921ca42b2b0655b'
    }

    mockCtx.prisma.challenge.delete.mockResolvedValue(
      Promise.resolve({
        challenge: signedChallenge.challenge,
        createdAt: new Date()
      }) as any
    )

    mockCtx.gatewayService.getEntityOwnerKeys.mockReturnValue(
      okAsync([
        `EddsaEd25519PublicKey("${signedChallenge.proof.publicKey}")`
      ]) as any
    )

    const result = await controller.login(signedChallenge, ctx.cookies)

    if (result.isErr()) {
      appLogger.error(result.error)
      throw result.error
    }
  })
})
