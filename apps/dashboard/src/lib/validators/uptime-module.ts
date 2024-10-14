import { BehaviorSubject } from 'rxjs'
import {
  calculateApy,
  getValidatorUptimeSinceDate,
  uptimePeriodDefinition,
  type UptimeValue
} from '@api/utils/entities/component/validator'
import BigNumber from 'bignumber.js'
import type { ValidatorCollectionItem } from '@common/gateway-sdk'

type ValidatorAddress = string

export type UptimeData = Partial<
  Record<UptimeValue, Record<ValidatorAddress, number | undefined>>
>

export const UptimeModule = () => {
  const isLoading = new BehaviorSubject<boolean>(false)
  let validators:
    | Promise<{ address: string; totalStakeInXRD: BigNumber }[]>
    | undefined
  let uptimeData: UptimeData = {}
  let totalAmountStaked: BigNumber | undefined
  return {
    setValidators: (
      promise: Promise<{ address: string; totalStakeInXRD: BigNumber }[]>
    ) => {
      validators = promise
      promise.then((v) => {
        totalAmountStaked = v.reduce(
          (prev, cur) => prev.plus(cur.totalStakeInXRD),
          new BigNumber(0)
        )
      })
    },
    getDataForUptime: (uptime: UptimeValue) => uptimeData[uptime] || {},
    getApy: (validator: ValidatorCollectionItem, uptime: UptimeValue) => {
      if (!totalAmountStaked) {
        throw new Error('Total amount staked not set')
      }
      const address = validator.address
      const fee = Number(validator.effective_fee_factor?.current?.fee_factor)
      const uptimePercentage = uptimeData[uptime]?.[address]
      return calculateApy(fee, uptimePercentage, totalAmountStaked)
    },
    maybeQueryUptime: async (uptime: UptimeValue | undefined) => {
      if (!uptime) return
      if (!validators) {
        throw new Error('Validators not set')
      }
      if (uptimeData[uptime]) {
        return uptimeData[uptime]
      }

      uptimeData[uptime] = {}

      isLoading.next(true)

      return validators
        .then((v) =>
          getValidatorUptimeSinceDate(v.map((v) => v.address))(
            uptimePeriodDefinition[uptime].getStartingPoint()
          )
        )
        .then((value) => {
          isLoading.next(false)
          if (value.isOk()) {
            uptimeData[uptime] = value.value
            return uptimeData[uptime]
          }
        })
        .catch((e) => {
          console.error(e)
          isLoading.next(false)
          uptimeData[uptime] = undefined
        })
    },
    clean: () => {
      validators = undefined
      uptimeData = {}
      totalAmountStaked = undefined
    },
    isLoading$: isLoading.asObservable()
  }
}

export const uptimeModule = UptimeModule()
