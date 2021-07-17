import { productEntityV1 } from '../../entity';
import { SORT_OPTIONS_CONST } from '../../config/constants';

// global Variable used
const Gender = global.Gender;

export class ProductControllerV1 {
    constructor() { }

    /**
    * @method GET
    * @param {number} page : current page no
    * @param {string} sortBy : sort result by
    * */
    async getProducts(payload: IProductRequestV1.IGetProducts) {
        try {
            let [totalCount, products] = await productEntityV1.getProducts(payload);

            return {
                totalCount,
                products
            }
        } catch (e) {
            throw e;
        }
    }

    /**
    * @method GET
    * @param {number} page : current page no
    * @param {string} sortBy : sort result by
    * */
    async getProductsWithCompleteData(payload: IProductRequestV1.IGetProducts) {
        try {
            let [products, brands, categories] = await productEntityV1.getProductsWithCompleteData(payload);

            products = products[0];

            return {
                totalCount: products.totalCount,
                products: products.products,
                filters: {
                    price: products.productsCountByPrice,
                    brands: brands,
                    categories: categories,
                    gender: Gender
                },
                sortOptions: Object.keys(SORT_OPTIONS_CONST).map(key => key.toLocaleLowerCase())
            }
        } catch (e) {
            throw e;
        }
    }
}

export const productController = new ProductControllerV1();