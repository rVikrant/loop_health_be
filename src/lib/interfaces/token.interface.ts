declare namespace IAuthRequest {

    interface ICreateTokenData {
        deviceid?: string,
        devicetype?: string,
        tokenType: string,
        id: string,
        masterId?: string,
        country?: string,
        isGuest?: number,
        issuedAt: number,
        apiversion?: string
    }

    interface AuthorizationObj {
        deviceid?: string,
        devicetype?: string,
        tokenType: string,
        id: string,
        masterId: string,
        country?: string,
        isGuest?: number,
        issuedAt: number,
        apiversion?: string
    }

    interface IVerifyTokenObj {
        token: string,
    }

    interface IVerifyBasicAuthObj {
        username: string,
        password: string,
    }
}