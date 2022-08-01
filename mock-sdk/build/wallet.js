"use strict";
exports.__esModule = true;
exports.Wallet = void 0;
var neverthrow_1 = require("neverthrow");
exports.Wallet = {
    isAvailable: function () { return true; },
    connect: function (name, info) { return (0, neverthrow_1.okAsync)({
        accounts: [
            {
                label: 'Main',
                address: 'rdx123'
            },
            {
                label: 'NFTs',
                address: 'rdx456'
            }
        ]
    }); },
    requestInfo: function () { },
    requestProof: function () { }
};
//# sourceMappingURL=wallet.js.map