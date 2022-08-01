export const transactionStatus = (txID: string, networkUrl: string) => fetch(`${networkUrl}/transaction/status`, {
    method: 'POST',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        network_identifier: {
            network: "mainnet"
        },
        transaction_identifier: {
            hash: txID
        }
    })
})