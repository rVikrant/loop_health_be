'use strict';
import * as Jwt from 'jsonwebtoken';
import { truncate } from 'node:fs';


// local dependencies
import { BaseService } from "../services";

const cert = process.env.jwtSecret;
const algo = process.env.jwtAlgo;

class TokenManager {

    constructor() {};

    async setToken(tokenData: IAuthRequest.ICreateTokenData) {
        try {
            // let expiretime = Constant.CONF.GENERAL.ACCESS_TOKEN_EXPIRE_TIME
            switch (tokenData.tokenType) {
                case "GUEST_AUTH": {
                    if (tokenData.id) {
                        // expiretime = Constant.CONF.GENERAL.REFRESH_TOKEN_EXPIRE_TIME
                        // tokenData["exp"] = Math.floor(Date.now() / 1000) + expiretime
                        break;
                    } else
                        throw {
                            "statusCode": 501,
                            "httpCode": 501,
                            "type": "TOKENIZATION_ERROR"
                        }
                }
                case "USER_AUTH": {
                    if (tokenData.id) {
                        // expiretime = Constant.CONF.GENERAL.ACCESS_TOKEN_EXPIRE_TIME
                        // tokenData["exp"] = Math.floor(Date.now() + expiretime)
                        break;
                    } else
                        throw {
                            "statusCode": 501,
                            "httpCode": 501,
                            "type": "TOKENIZATION_ERROR"
                        }
                }
                case "ADMIN_AUTH": {
                    console.log("tokenData00----", tokenData);
                    if (tokenData.id) {
                        // expiretime = Constant.CONF.GENERAL.ACCESS_TOKEN_EXPIRE_TIME
                        // tokenData["exp"] = Math.floor(Date.now() + expiretime)
                        break;
                    } else
                        throw {
                            "statusCode": 501,
                            "httpCode": 501,
                            "type": "TOKENIZATION_ERROR"
                        }
                }
                default: {
                    throw {
                        "statusCode": 501,
                        "httpCode": 501,
                        "type": "TOKENIZATION_ERROR"
                    }
                }
            }
            const token = await Jwt.sign(tokenData, cert, { algorithm: algo });
            console.log(__filename, 'token', token, true)

            return token
        } catch (error) {
            console.log(__filename, 'setToken', error, false)
            throw {
                "statusCode": 501,
                "httpCode": 501,
                "type": "TOKENIZATION_ERROR"
            }
        }
    };

    async  verifyToken(token: string) {
        try {

            const tokenData: IAuthRequest.ICreateTokenData = await Jwt.verify(token, cert, { algorithms: [algo] });
            console.log(__filename, "tokenData", JSON.stringify(tokenData), true)

            // if (tokenData && tokenData.id && tokenData.deviceid) {
            //     // data['id'] = [tokenData.id]
            //     let getSession = await ENTITY.SessionE.getSession(tokenData.deviceid, tokenData.id)
            //     if (getSession && getSession.id) {

            //     } else {
            //         console.log("session not found");
            //         throw {
            //             "statusCode": 401,
            //             "httpCode": 401,
            //             "type": "UNAUTHORIZED"
            //         };
            //     }

            // } else {
            if (!tokenData.id) {
                console.log("id not found");

                throw {
                    "statusCode": 401,
                    "httpCode": 401,
                    "type": "UNAUTHORIZED"
                };
            }

            switch (tokenData.tokenType) {
                case "GUEST_AUTH": {
                    if (tokenData.id) {
                        const tokenVerifiedData: IAuthRequest.AuthorizationObj = {
                            tokenType: tokenData.tokenType,
                            deviceid: tokenData.deviceid || "",
                            devicetype: tokenData.devicetype || "",
                            id: tokenData.id,
                            masterId: tokenData.masterId || "",
                            country: tokenData.country || "",
                            isGuest: tokenData.isGuest || 0,
                            issuedAt: tokenData.issuedAt || 0,
                            apiversion: tokenData.apiversion || ""
                        };
                        return tokenVerifiedData
                    } else {
                        console.log("id not found in guest auth");
                        throw {
                            "statusCode": 401,
                            "httpCode": 401,
                            "type": "UNAUTHORIZED"
                        };
                    }
                }
                case "USER_AUTH": {
                    if (tokenData.id) {
                        const tokenVerifiedData: IAuthRequest.AuthorizationObj = {
                            tokenType: tokenData.tokenType,
                            deviceid: tokenData.deviceid || "",
                            devicetype: tokenData.devicetype || "",
                            id: tokenData.id,
                            masterId: tokenData.masterId || "",
                            country: tokenData.country || "",
                            isGuest: tokenData.isGuest || 0,
                            issuedAt: tokenData.issuedAt || 0,
                            apiversion: tokenData.apiversion || ""
                        };
                        return tokenVerifiedData
                    } else {
                        console.log("id not found in user auth");
                        throw {
                            "statusCode": 401,
                            "httpCode": 401,
                            "type": "UNAUTHORIZED"
                        };
                    }
                }
                case "ADMIN_AUTH": {
                    let dao = new BaseService("Admin");

                    if (tokenData.id) {
                        const tokenVerifiedData: IAuthRequest.AuthorizationObj = {
                            tokenType: tokenData.tokenType,
                            deviceid: tokenData.deviceid || "",
                            devicetype: tokenData.devicetype || "",
                            id: tokenData.id,
                            masterId: tokenData.masterId || "",
                            country: tokenData.country || "",
                            isGuest: tokenData.isGuest || 0,
                            issuedAt: tokenData.issuedAt || 0,
                            apiversion: tokenData.apiversion || ""
                        };

                        let authCheck = await dao.getOneEntityMdb({
                            _id: globalThis.ObjectId(tokenData.id),
                            $and: [
                                {issuedAt: {$gt: 0}},
                                {issuedAt: tokenData.issuedAt}
                            ]
                        }, {}, {lean: true});

                        if(authCheck) {
                            return tokenVerifiedData
                        } else {
                            throw {
                                "statusCode": 401,
                                "httpCode": 401,
                                "type": "UNAUTHORIZED"
                            };
                        }
                        
                    } else {
                        console.log("id not found in user auth");
                        throw {
                            "statusCode": 401,
                            "httpCode": 401,
                            "type": "UNAUTHORIZED"
                        };
                    }
                }
                default: {
                    console.log("tokenType not found");
                    throw {
                        "statusCode": 401,
                        "httpCode": 401,
                        "type": "UNAUTHORIZED"
                    };
                }
            }
        } catch (error) {
            console.log("error in verify token");
            throw {
                "statusCode": 401,
                "httpCode": 401,
                "type": "UNAUTHORIZED"
            };
        }
    };

    async  decodeToken(token: string) {
        try {
            const tokenData: IAuthRequest.ICreateTokenData = await Jwt.verify(token, cert, { algorithms: [algo] });
            return tokenData
        } catch (error) {
            throw {
                "statusCode": 501,
                "httpCode": 501,
                "type": "TOKENIZATION_ERROR"
            }
        }
    };
}

export const tokenManager = new TokenManager();