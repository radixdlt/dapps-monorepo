import xrdIcon from '@icons/xrd-token-icon.svg'
import { RadixNetwork } from '@common/gateway-sdk'

export const Network = {
  MAINNET: 'mainnet',
  HAMMUNET: 'hammunet',
  ENKINET: 'enkinet',
  GILGANET: 'gilganet',
  MARDUNET: 'mardunet',
  STOKENET: 'stokenet',
  DUMUNET: 'dumunet'
} as const

export const NETWORK_CONFIG = {
  [Network.HAMMUNET]: {
    id: 34,
    url: 'https://hammunet-gateway.radixdlt.com',
    consoleDappAddress:
      'account_tdx_22_16xygyhqp3x3awxlz3c5dzrm7jqghgpgs776v4af0yfr7xljqfw9zgy',
    dashboardDappAddress:
      'account_tdx_22_16xygyhqp3x3awxlz3c5dzrm7jqghgpgs776v4af0yfr7xljqfw9zgy'
  },
  [Network.ENKINET]: {
    id: 33,
    url: 'https://enkinet-gateway.radixdlt.com',
    consoleDappAddress:
      'account_tdx_21_129c3uarzmguw2rtmmuq3hv0eycktvj3achtzzkh5qra4ctsv6nl5fu',
    dashboardDappAddress:
      'account_tdx_21_129c3uarzmguw2rtmmuq3hv0eycktvj3achtzzkh5qra4ctsv6nl5fu'
  },
  [Network.GILGANET]: {
    id: 32,
    url: 'https://gilganet-gateway.radixdlt.com',
    consoleDappAddress:
      'account_tdx_22_1prtqhxd5mmq2nj3mrhcztxphauy29qeuk5walu49spjsqpjxr6',
    dashboardDappAddress:
      'account_tdx_22_1prtqhxd5mmq2nj3mrhcztxphauy29qeuk5walu49spjsqpjxr6'
  },
  [Network.MARDUNET]: {
    id: 36,
    url: 'https://mardunet-gateway.radixdlt.com',
    consoleDappAddress: 'account_tdx_24_thisdummyvalue12345',
    dashboardDappAddress: 'account_tdx_24_thisdummyvalue12345'
  },
  [Network.STOKENET]: {
    id: 2,
    url: 'https://babylon-stokenet-gateway.radixdlt.com',
    consoleDappAddress:
      'account_tdx_2_128evrrwfp8gj9240qq0m06ukhwaj2cmejluxxreanzjwq62vmlf8r4',
    dashboardDappAddress:
      'account_tdx_2_12xdm5g7xdhh73zkh7xkty0dsxw4rw0jl0sq4lr3erpc3xdn54zx0le'
  },
  [Network.MAINNET]: {
    id: RadixNetwork.Mainnet,
    url: 'https://mainnet.radixdlt.com',
    consoleDappAddress:
      'account_rdx12xe5q56q0cen0vunfsh352tslz6vyfwf4qujcez5vdjmlm0rzcngs8',
    dashboardDappAddress:
      'account_rdx12x0xfz2yumu2qsh6yt0v8xjfc7et04vpsz775kc3yd3xvle4w5d5k5'
  },
  [Network.DUMUNET]: {
    id: RadixNetwork.Dumunet,
    url: 'https://dumunet-gateway.radixdlt.com',
    consoleDappAddress:
      'account_tdx_25_168e8u653alt59xm8ple6khu6cgce9cfx9mlza6wxf7qs3wwdyt96gk',
    dashboardDappAddress:
      'account_tdx_25_168e8u653alt59xm8ple6khu6cgce9cfx9mlza6wxf7qs3wwdyt96gk'
  }
} as const

export const XRD_NAME = 'Radix'
export const XRD_SYMBOL = 'XRD'

export const VIEW_PORTS = { desktop: 768 }

export const XRDToken = {
  name: XRD_SYMBOL,
  iconUrl: xrdIcon
}

export const EXPECTED_EPOCH_TIME_MINUTES = 5

export const RET_DECIMAL_PRECISION = 18

export const YEARLY_XRD_EMISSIONS = 300_000_000

export const DEV_SAFE_IMAGE_SERVICE_URL =
  'https://image-service-dev.extratools.works'

export const PROD_SAFE_IMAGE_SERVICE_URL = 'https://image-service.radixdlt.com'

export const NON_EXTERNAL_ORIGINS = ['https://www.radixdlt.com']

export const PERCENTAGE_TOTAL_STAKE_WARNING = 3
