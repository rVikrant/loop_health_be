import { privateDecrypt } from 'crypto';
import { brandEntityV1, categoryEntityV1, productEntityV1 } from '../../entity';

export class FilterControllerV1 {
    constructor() { }

    /**
    * @method GET
    * */
    async getFilters() {
        try {
            let [brands, categories] = await Promise.all([
                brandEntityV1.getBrands(),
                categoryEntityV1.getCategories(),
            ]);

            return {
                brands,
                categories,
                price: global.Price,
                gender: global.Gender,
            }
        } catch (e) {
            throw e;
        }
    }

    /**
    * @method GET
    * */
    async getFiltersWithProducts() {
        try {
            let [brands, categories, price] = await Promise.all([
                brandEntityV1.getBrandsWithProducts(),
                categoryEntityV1.getCategoriesWithProducts(),
                productEntityV1.productsGroupedByPrice()
            ]);

            return {
                brands,
                categories,
                price: price,
                gender: global.Gender,
            }
        } catch (e) {
            throw e;
        }
    }
}

export const filterController = new FilterControllerV1();