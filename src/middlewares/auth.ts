// dependencies
import { Middleware, Context } from 'koa';

// local dependencies
import { authService } from "../services/auth";

export default (opts?): Middleware => {
    return async (ctx: Context, next) => {
        try {
            console.log(__filename, 'authorization', ctx.header.authorization, true);
            console.log(__filename, 'header', JSON.stringify(ctx.header), true);

            let settings = "Bearer";
            let authorization = ctx.header.authorization;

            if (!authorization) {
                console.log("authorization not found");
                throw {
                    "statusCode": 401,
                    "httpCode": 401,
                    "type": "UNAUTHORIZED"
                };
            }

            const [tokenType, token] = authorization.split(/\s+/);

            if (!token || tokenType.toLowerCase() !== settings.toLowerCase()) {
                console.log("invalid token prefix");
                throw {
                    "statusCode": 401,
                    "httpCode": 401,
                    "type": "ACCESS_TOKEN_EXPIRED"
                };
            }

            let tokenData: IAuthRequest.AuthorizationObj = await authService.verifyToken({ token: token })

            if (!tokenData || !tokenData.tokenType) {
                if (!tokenData.tokenType)
                    console.log("tokenType not found");

                throw {
                    "statusCode": 401,
                    "httpCode": 401,
                    "type": "ACCESS_TOKEN_EXPIRED"
                };
            }

            ctx.state.user = tokenData
        } catch (error) {
            console.log("catch error auth middleware");

            throw {
                "statusCode": 401,
                "httpCode": 401,
                "type": "ACCESS_TOKEN_EXPIRED"
            };
        }
        await next()
    }
}

