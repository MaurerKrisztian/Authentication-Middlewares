
export interface IHelperInitOption {
    jwtSecret: string,
    isBearer: boolean,
    tokenPath: string
    expiresIn?: string | '1m' | '1h' | '1d' | '1y';
}

export interface ITokenInfo {
    roles: string[]
}
