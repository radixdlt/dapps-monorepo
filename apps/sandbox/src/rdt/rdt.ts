import { BehaviorSubject, tap } from 'rxjs'
import {
  DataRequestBuilder,
  EnvironmentModule,
  GatewayModule,
  LocalStorageModule,
  RadixDappToolkit,
  RadixDappToolkitOptions,
  StateModule,
  WalletRequestModule,
  generateGatewayApiConfig
} from '@common/rdt'
import { appLogger } from '../logger/state'
import {
  bootstrapNetwork,
  networkId as networkIdSubject
} from '../network/state'
import { createObservableHook } from '../helpers/create-observable-hook'
import { setAccounts } from '../account/state'
import { addEntities } from '../entity/state'
import { createChallenge } from '../helpers/create-challenge'
import { RadixNetwork } from '@common/gateway-sdk'
import { connectButtonConfigSubject } from './state'
import { GatewayApiClient } from './gateway-api-client'

const networkId = networkIdSubject.value

const getDAppDefinitionFromLocalStorage = (): Record<string, string> => {
  try {
    const raw = localStorage.getItem('dAppDefinitionAddress')
    if (!raw) {
      appLogger.debug(
        'No dAppDefinitionAddress found in localStorage, defaulting'
      )
      return {
        [RadixNetwork.Kisharnet]:
          'account_tdx_c_1pysl6ft839lj0murylf2vsmn57e67v20px435v37tejqv0famt',
        [RadixNetwork.Hammunet]:
          'account_tdx_22_12xt9uxe39dxdfy9c23vn0qj7eaxs8p3fjjpkr8f48edsfvyk00ck3l',
        [RadixNetwork.Enkinet]:
          'account_tdx_21_168ydk240yx69yl7zdz2mzkdjc3r5p6n4gwypqsype2d6d942z0tyvx',
        [RadixNetwork.RCnetV3]:
          'account_tdx_e_12965dqmkmgs96s5cx7r52dg0shjvl7urwqy8eqeq2heym89ralzqdp',
        [RadixNetwork.Mainnet]:
          'account_rdx12y7md4spfq5qy7e3mfjpa52937uvkxf0nmydsu5wydkkxw3qx6nghn',
        [RadixNetwork.Stokenet]:
          'account_tdx_2_12yf9gd53yfep7a669fv2t3wm7nz9zeezwd04n02a433ker8vza6rhe'
      }
    }

    const parsed = JSON.parse(raw)
    return parsed
  } catch (error) {
    return {}
  }
}

const getDAppDefinitionAddressDefault = () =>
  getDAppDefinitionFromLocalStorage()[networkId] || ''

export const dAppDefinitionAddress = new BehaviorSubject<string>(
  getDAppDefinitionAddressDefault()
)

export const setDAppDefinitionAddress = (value: string) => {
  const currentData = getDAppDefinitionFromLocalStorage()
  localStorage.setItem(
    'dAppDefinitionAddress',
    JSON.stringify({ ...currentData, [networkId]: value })
  )
  location.reload()
}

export const useDAppDefinitionAddress = createObservableHook(
  dAppDefinitionAddress,
  getDAppDefinitionAddressDefault()
)

bootstrapNetwork(networkId)

const applicationName = 'Radix Sandbox dApp'
const applicationVersion = '1.0.0'

export const gatewayApi = GatewayApiClient({
  networkId,
  applicationName,
  dAppDefinitionAddress: dAppDefinitionAddress.value,
  applicationVersion
})

const environmentModule = EnvironmentModule()

const storageModule = LocalStorageModule(
  `rdt:${dAppDefinitionAddress.value}:${networkId}`,
  {
    providers: {
      environmentModule
    }
  }
)

const stateModule = StateModule({
  logger: appLogger as any,
  providers: {
    storageModule: storageModule.getPartition('state')
  }
})

const gatewayModule = GatewayModule({
  logger: appLogger as any,
  clientConfig: generateGatewayApiConfig({
    networkId,
    dAppDefinitionAddress: dAppDefinitionAddress.value,
    applicationName,
    applicationVersion
  })
})

const walletRequestModule = WalletRequestModule({
  logger: appLogger as any,
  useCache: false,
  networkId,
  dAppDefinitionAddress: dAppDefinitionAddress.value,
  providers: {
    stateModule,
    storageModule,
    gatewayModule,
    environmentModule
  }
})

export const dataRequestStateModule = walletRequestModule.dataRequestStateModule

const options = {
  dAppDefinitionAddress: dAppDefinitionAddress.value,
  networkId,
  logger: appLogger as any,
  providers: {
    stateModule,
    storageModule,
    gatewayModule,
    walletRequestModule
  },
  useCache: false
} satisfies RadixDappToolkitOptions

setTimeout(() => {
  appLogger.debug('RDT initialized with', options)
}, 1000)

export const rdt = RadixDappToolkit(options)

rdt.walletApi.setRequestData(DataRequestBuilder.accounts().atLeast(1))

rdt.walletApi.walletData$.subscribe((state) => {
  setAccounts(state.accounts)
  if (state.persona)
    addEntities([
      {
        address: state.persona?.identityAddress,
        type: 'identity'
      }
    ])
})

rdt.walletApi.provideChallengeGenerator(async () => createChallenge())

rdt.walletApi.setRequestData(
  DataRequestBuilder.config({
    personaData: { fullName: true },
    accounts: { numberOfAccounts: { quantifier: 'atLeast', quantity: 1 } }
  })
)

connectButtonConfigSubject
  .pipe(
    tap((value) => {
      rdt.buttonApi.setTheme(value.theme as any)
      rdt.buttonApi.setMode(value.mode as any)
    })
  )
  .subscribe()
