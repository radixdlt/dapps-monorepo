import type { ValidatorCollectionItem } from '@common/gateway-sdk'
import { UptimeModule } from './uptime-module'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import BigNumber from 'bignumber.js'
import { ok } from 'neverthrow'

describe('uptime module', () => {
  let uptimeModule: UptimeModule
  let getUptimeFromDateSpy = vi.fn()
  let getValidatorsUptimeSpy = vi.fn().mockReturnValue(getUptimeFromDateSpy)

  beforeEach(() => {
    uptimeModule = UptimeModule({
      getValidatorUptimeSinceDate: getValidatorsUptimeSpy
    })
  })

  describe('initial state, without validators set', () => {
    it('should do nothing when called without uptime', () => {
      const result = uptimeModule.maybeQueryUptime(undefined)
      expect(getValidatorsUptimeSpy).not.toHaveBeenCalled()
      expect(result).toBeUndefined()
    })

    it('should throw when trying to query uptime', () => {
      expect(() => uptimeModule.maybeQueryUptime('1month')).toThrowError(
        /Validators not set/
      )
    })

    it('should return empty object when getting data', () => {
      expect(uptimeModule.getDataForUptime('1month')).toEqual({})
    })

    it('should return undefined when trying to get APY', () => {
      expect(
        uptimeModule.getApy({} as ValidatorCollectionItem, '1month')
      ).toBeUndefined()
    })
  })

  describe('with validators', () => {
    beforeEach(() => {
      uptimeModule.setValidators(
        Promise.resolve([
          { address: '1', totalStakeInXRD: new BigNumber(1) },
          { address: '2', totalStakeInXRD: new BigNumber(2) }
        ])
      )
    })

    it('should not throw when getting APY', () => {
      expect(() =>
        uptimeModule.getApy(
          {
            address: '1',
            effective_fee_factor: { current: { fee_factor: '0' } }
          } as unknown as ValidatorCollectionItem,
          '1month'
        )
      ).not.toThrow()
    })

    describe('with `maybeQueryUptime` called', () => {
      let data: any
      beforeEach(async () => {
        getUptimeFromDateSpy.mockResolvedValueOnce(
          ok({
            '1': 0.5,
            '2': 0.75
          })
        )

        data = await uptimeModule.maybeQueryUptime('1month')
      })

      it('should call getValidatorUptimeSinceDate', () => {
        expect(getUptimeFromDateSpy).toHaveBeenCalled()
        expect(data.value).toEqual({
          '1': 0.5,
          '2': 0.75
        })
      })

      it('should calculate APY correctly', async () => {
        const apy = uptimeModule.getApy(
          {
            address: '1',
            effective_fee_factor: { current: { fee_factor: '0.5' } }
          } as unknown as ValidatorCollectionItem,
          '1month'
        )
        expect(apy).toBe(25000000)
      })

      it('should return data from cache if possible', () => {
        const data = uptimeModule.maybeQueryUptime('1month')
        expect(data).toEqual({
          '1': 0.5,
          '2': 0.75
        })
      })

      it('should clean data correctly', () => {
        uptimeModule.clean()
        expect(() => uptimeModule.maybeQueryUptime('1month')).toThrowError(
          /Validators not set/
        )
      })
    })
  })
})
