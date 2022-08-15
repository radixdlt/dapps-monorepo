const apiCall = (path: string, body?: any) => (networkUrl: string) =>
  fetch(networkUrl + path, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      network_identifier: {
        network: 'mainnet'
      },
      ...body
    })
  })

const transactionStatus = (txID: string) =>
  apiCall('/transaction/status', {
    transaction_identifier: {
      hash: txID
    }
  })

const validators = apiCall('/validators')

const getStakePositions = (address: string) => async (networkUrl: string) => ({
  json: async () => ({
    pending_stakes: [
      {
        validator_identifier: 'rv1qwukra5el9xl0efggr29a64kmr9t04m7a5r7zsxc8jtfr9ru7ue9u6z9g0h',
        value: '3000000000000000000000'
      }
    ],
    stakes: [
      {
        validator_identifier: 'rv1qfk9vhrzapxykvst6dk58y2pn3dj7xl44l8mklt69y7qcj86vad32rdxart',
        value: '10000000000000000000000'
      }
    ]
  })
})

export const Gateway = {
  transactionStatus,
  validators,
  getStakePositions
}
