import { BehaviorSubject } from 'rxjs'
import {
  getValidatorUptimeSinceDate as getValidatorUptimeSinceDateOriginal,
  uptimePeriodDefinition,
  type UptimeValue
} from '@api/utils/entities/component/validator'
import BigNumber from 'bignumber.js'
import type { ValidatorCollectionItem } from '@common/gateway-sdk'
import { YEARLY_XRD_EMISSIONS } from '@constants'

/**
 * Uptime Data is an object which contains validator->uptime mapping for a specific uptime period.
 *
 * Example of Uptime Data:
 * {
 *  '1day': {
 *     'validator_xyz': 0.99,
 *     'validator_xxx': 0.54,
 *   },
 *  '1month': {
 *     'validator_abc': 0.99,
 *     'validator_bcd': 0.54,
 *   },
 * }
 */
export type UptimeData = Partial<
  Record<UptimeValue, Record<string, number | undefined>>
>

export type UptimeModule = ReturnType<typeof UptimeModule>
export const UptimeModule = (
  dependencies: {
    getValidatorUptimeSinceDate: typeof getValidatorUptimeSinceDateOriginal
  } = {
    getValidatorUptimeSinceDate: getValidatorUptimeSinceDateOriginal
  }
) => {
  const { getValidatorUptimeSinceDate } = dependencies
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
      if (!totalAmountStaked || totalAmountStaked.isZero()) {
        throw new Error('Invalid totalAmountStaked')
      }
      const address = validator.address
      const fee = Number(validator.effective_fee_factor?.current?.fee_factor)
      const uptimePercentage = uptimeData[uptime]?.[address]

      return new BigNumber(YEARLY_XRD_EMISSIONS)
        .multipliedBy((1 - fee) * (uptimePercentage ?? 0))
        .dividedBy(totalAmountStaked)
        .toNumber()
    },
    maybeQueryUptime: (uptime: UptimeValue | undefined) => {
      if (!uptime) return
      if (!validators) {
        throw new Error('Validators not set. Call `setValidators` first.')
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
