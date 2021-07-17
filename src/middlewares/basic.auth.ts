"use strict";

// dependencies
import { Middleware, Context } from 'koa';

// local dependencies
import { authService } from "../services/auth";


export default (opts?): Middleware => {
    return async (ctx: Context, next) => {
        try {
            console.log(__filename, 'header', JSON.stringify(ctx.header), true)

            let settings = "Basic"
            let authorization = ctx.header;

            if (!("authenticationtype" in authorization && "credentials" in authorization)) {
                console.log("authorization not found");
                throw {
                    "statusCode": 401,
                    "httpCode": 401,
                    "type": "UNAUTHORIZED"
                };
            }
            const { authenticationtype, credentials } = authorization;
            // @ts-ignore
            if (authenticationtype.toLowerCase() !== settings.toLowerCase()) {
                console.log("invalid token prefix");
                throw {
                    "statusCode": 401,
                    "httpCode": 401,
                    "type": "ACCESS_TOKEN_EXPIRED"
                }
            }
            // @ts-ignore
            let decodeCredentials = Buffer.from(credentials, 'base64').toString('ascii');
            const [username, password] = decodeCredentials.split(':');

            await authService.verifyBasicAuth({ username, password })

        } catch (error) {
            console.log("catch error in basic auth");
            throw {
                "statusCode": 401,
                "httpCode": 401,
                "type": "UNAUTHORIZED"
            };
        }
        await next()
    }
}

