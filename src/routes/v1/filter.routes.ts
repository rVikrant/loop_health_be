// reuired dependencies
import * as Joi from '@hapi/joi';
import * as Router from 'koa-router';

// lcoal
import { getMiddleware, validate } from '../../middlewares';

// controller
import { filterController } from '../../controllers';


export default (router: Router) => {
    router.get('/1',
        ...getMiddleware([
            "basic_auth"
        ]),
        validate({
            query: {}
        }),
        async (ctx) => {
            try {
                let res = await filterController.getFilters();

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
            query: {}
        }),
        async (ctx) => {
            try {
                let res = await filterController.getFiltersWithProducts();

                ctx.status = 200;
                ctx.body = res;

            } catch (e) {
                throw e;
            }
        }
    )
}