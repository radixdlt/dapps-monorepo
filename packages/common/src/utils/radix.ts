import BigNumber from 'bignumber.js'
import { EXPECTED_EPOCH_TIME_MINUTES } from './constants'

export const timeToEpoch = (currentEpoch: number, toEpoch: number) => {
  const MINUTES_HOUR = 60
  const HOURS_DAY = 24
  const MINUTES_DAY = MINUTES_HOUR * HOURS_DAY

  const diff = new BigNumber(toEpoch).minus(currentEpoch)
  const daysToClaim = diff
    .multipliedBy(EXPECTED_EPOCH_TIME_MINUTES)
    .dividedBy(MINUTES_DAY)

  if (daysToClaim.isLessThan(1)) {
    const hoursToClaim = daysToClaim.multipliedBy(HOURS_DAY)

    if (hoursToClaim.isLessThan(1)) {
      const minutesToClaim = hoursToClaim.multipliedBy(MINUTES_HOUR)

      if (minutesToClaim.lt(EXPECTED_EPOCH_TIME_MINUTES)) {
        return `less than ${EXPECTED_EPOCH_TIME_MINUTES} minutes`
      }
      return `${minutesToClaim.toFixed(0)} minutes`
    }
    return `${hoursToClaim.toFixed(0)} hours`
  }
  return `${daysToClaim.toFixed(0)} days`
}
