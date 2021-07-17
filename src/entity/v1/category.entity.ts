import { Stats } from 'fs';
import { BaseEntity } from '../base.entity';

// global variable used
const Status = global.Status;

export class CategoryEntityV1 extends BaseEntity {
    constructor() {
        super("Category");
    }

    async getCategories() {
        try {

            let options = {};

            //@ts-ignore
            return await this.getMultipleMdb({ status: Status.ACTIVE }, {}, options);
        } catch(e) {
            throw e;
        }
    }

    async getCategoriesWithProducts() {
        try {

            let options = {};

            let criteria = { status: Status.ACTIVE };

            return await this.aggregateMdb([
                {$match: criteria}, 
                {
                    $lookup: {
                        from: "products",
                        localField: "name",
                        foreignField: "category",
                        as: "products"
                }},
                {
                    $group: {
                        _id: "$name",
                        count: {$sum: 1}
                    }
                },
                {
                    $project: {
                        _id: 0,
                        id: "$_id",
                        count: "$count" 
                    }
                }
            ]);
        } catch(e) {
            throw e;
        }
    }
}

export const categoryEntityV1 = new CategoryEntityV1();