"use strict";

// local dependencies
import { tokenManager } from '../../lib/token.manager'

export class AuthService {

    constructor() { }

    async createToken(payload: IAuthRequest.ICreateTokenData) {
        try {
            let token: string = await tokenManager.setToken(payload)
            return { token }
        } catch (error) {
            console.log(__filename,"AuthController : createToken", error, false)
            return Promise.reject(error)
        }
    }

    async verifyToken(payload: IAuthRequest.IVerifyTokenObj) {
        try {
            let tokenData: IAuthRequest.AuthorizationObj = await tokenManager.verifyToken(payload.token)
            return tokenData
        } catch (error) {
            console.log(__filename,"AuthController : verifyToken", error, false)
            return Promise.reject(error)
        }
    }

    async decodeToken(payload: IAuthRequest.IVerifyTokenObj) {
        try {
            //@ts-ignore
            let tokenData: IAuthRequest.AuthorizationObj = await tokenManager.decodeToken(payload.token)
            return tokenData
        } catch (error) {
            console.log(__filename,"AuthController : decodeToken", error, false)
            return Promise.reject(error)
        }
    }
    
    async verifyBasicAuth(payload: IAuthRequest.IVerifyBasicAuthObj) {
        try {
            const {username, password} = payload;

            console.log(__filename, "verify basic auth", JSON.stringify(payload), true);

            if (username == process.env.BASIC_AUTH_USERNAME && password == process.env.BASIC_AUTH_PASSWORD) {
                return {};
            } 

            throw {
                "statusCode": 401,
                "httpCode": 401,
                "type": "UNAUTHORIZED"
            };
        } catch (error) {
            console.log(__filename,"AuthController : verifyBasicAuth", error, false);
            throw error;
        }
    }
}

export const authService = new AuthService();