// reuired dependencies
import * as Joi from '@hapi/joi';
import * as Router from 'koa-router';

// lcoal
import { getMiddleware, validate } from '../../middlewares';

// controller
import { productController } from '../../controllers';


export default (router: Router) => {
    router.get('/1',
        ...getMiddleware([
            "basic_auth"
        ]),
        validate({
            query: {
                page: Joi.number().min(1).error(new Error("INVALID_PAGE_VALUE")),
                sortBy: Joi.string().error(new Error("DEFAULT_VALIDATION_ERROR"))
            }
        }),
        async (ctx) => {
            try {
                let query: IProductRequestV1.IGetProducts = ctx.request.query;

                let res = await productController.getProducts(query);

                ctx.status = 200;
                ctx.body = res;

            } catch (e) {
                throw e;
            }
        }
    )
        .get('/',
            ...getMiddleware([
                // "basic_auth"
            ]),
            validate({
                query: {
                    page: Joi.number().min(1).error(new Error("INVALID_PAGE_VALUE")),
                    sortBy: Joi.string().error(new Error("DEFAULT_VALIDATION_ERROR")),
                    search: Joi.string().error(new Error("DEFAULT_VALIDATION_ERROR"))
                }
            }),
            async (ctx) => {
                try {
                    let query: IProductRequestV1.IGetProducts = ctx.request.query;

                    let res = await productController.getProductsWithCompleteData(query);

                    ctx.status = 200;
                    ctx.body = res;

                } catch (e) {
                    throw e;
                }
            }
        )
        .post('/filter-by',
            ...getMiddleware([
                // "basic_auth"
            ]),
            validate({
                body: {
                    page: Joi.number().min(1).error(new Error("INVALID_PAGE_VALUE")),
                    sortBy: Joi.string().error(new Error("DEFAULT_VALIDATION_ERROR")),
                    brands: Joi.array().error(new Error("DEFAULT_VALIDATION_ERROR")),
                    categories: Joi.array().error(new Error("DEFAULT_VALIDATION_ERROR")),
                    gender: Joi.string().error(new Error("DEFAULT_VALIDATION_ERROR")),
                }
            }),
            async (ctx) => {
                try {
                    let query: IProductRequestV1.IGetProducts = ctx.request.body

                    let res = await productController.getProducts(query);

                    ctx.status = 200;
                    ctx.body = res;

                } catch (e) {
                    throw e;
                }
            }
        )
}