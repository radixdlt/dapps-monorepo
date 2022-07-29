import { okAsync, type ResultAsync } from "neverthrow"

export const Wallet = {
    isAvailable: () => true,
    connect: (name: string, info?: UserInfoRequest): ResultAsync<UserInfo, Error> => okAsync({
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
    }),
    requestInfo: () => { },
    requestProof: () => { }
}

type Err = {
    isErr: () => true
}

type Account = {
    label: string,
    address: string
}

export type UserInfo = {
    accounts: Account[],
    profile?: Record<string, string>,
    identity?: string
}

type UserInfoRequest = {
    accounts?: string[] | 'any',
    profile?: Record<string, string>
}