"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
exports.Gateway = void 0;
var apiCall = function (path, body) { return function (networkUrl) { return fetch(networkUrl + path, {
    method: 'POST',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(__assign({ network_identifier: {
            network: 'mainnet'
        } }, body))
}); }; };
var transactionStatus = function (txID) { return apiCall('/transaction/status', {
    transaction_identifier: {
        hash: txID
    }
}); };
var validators = apiCall('/validators');
exports.Gateway = {
    transactionStatus: transactionStatus,
    validators: validators
};
//# sourceMappingURL=gateway.js.map