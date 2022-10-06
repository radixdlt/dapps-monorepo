import { describe, expect, it } from 'vitest'
import { render } from '@testing-library/svelte'
import ValidatorList from './ValidatorList.svelte'
import type { ValidatorTransformedArray } from '@types'
import userEvent from '@testing-library/user-event'

const validators: ValidatorTransformedArray = [
  {
    address: '',
    name: 'Test Validator',
    totalStake: 110,
    ownerStake: 10,
    uptimePercentage: 10,
    feePercentage: 2,
    stakePercentage: 5,
    ownerStakePercentage: 10,
    stakeAccepted: true
  }
]

describe('ValidatorList', () => {
  describe('search by name', () => {
    it('should render the correct validator when searching by name', async () => {
      const user = userEvent.setup()

      const { getByText, getByPlaceholderText } = render(ValidatorList, {
        props: {
          validators
        }
      })

      const searchInput = getByPlaceholderText('Search by name')

      await user.type(searchInput, 'Test')

      const element = getByText('Test Validator')

      expect(element).toBeDefined()
    })

    it('should exclude validator from render if search is a mismatch', async () => {
      const user = userEvent.setup()

      const { getByText, getByPlaceholderText } = render(ValidatorList, {
        props: {
          validators
        }
      })

      const searchInput = getByPlaceholderText('Search by name')

      await user.type(searchInput, 'Searching for something random')

      expect(() => getByText('Test Validator')).toThrowError()
    })
  })
})
