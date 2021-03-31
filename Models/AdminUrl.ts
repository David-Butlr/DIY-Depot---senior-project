export enum URL_TYPE {
    BLACKLISTED,
    WHITELISTED
}

export type AdminUrl = {
    path: string

    type: URL_TYPE

    id: string
}
