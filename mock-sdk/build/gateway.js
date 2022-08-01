"use strict";
exports.__esModule = true;
exports.transactionStatus = void 0;
var transactionStatus = function (txID, networkUrl) { return fetch("".concat(networkUrl, "/transaction/status"), {
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
}); };
exports.transactionStatus = transactionStatus;
//# sourceMappingURL=gateway.js.map