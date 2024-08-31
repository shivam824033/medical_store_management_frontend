export class Login {
    username: string | undefined;
    password: String | undefined;

    constructor(){}
}

export class LoginResponse {
    accessToken!: string;
    refreshToken: String | undefined;
    errorMessage:string| undefined;
    statusCode: number| undefined;
    response: Userdetails|undefined;

    constructor(){}
}

export class Userdetails {
    userId: number|undefined;
    username: string | undefined;
    email: String | undefined;
    roles:string|undefined
    accountStatus: string | undefined;
    storeName: String | undefined;
    address:string|undefined

    constructor(){}
}


export class SecretKeyResponse {
    secretKey: string | undefined;
    errorMessage: String | undefined;
    statusCode: number| undefined;

    constructor(){}
}