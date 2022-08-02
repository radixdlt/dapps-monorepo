const apiCall = (path: string, body?: any) => (networkUrl: string) => fetch(networkUrl + path, {
    method: 'POST',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        network_identifier: {
            network: 'mainnet'
        },
        ...body
    })
})

const transactionStatus = (txID: string) => apiCall('/transaction/status', {
    transaction_identifier: {
        hash: txID
    }
})

const validators = apiCall('/validators')

export const Gateway = {
    transactionStatus,
    validators
}