export const shortenAddress = (address: string) =>
    address.slice(0, 5) +
    '...' +
    address.slice(address.length - 4, address.length);

export const toWholeUnits = (tokenValue: string) => parseInt(tokenValue) / 10 ** 18;
