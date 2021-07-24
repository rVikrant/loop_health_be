import { BaseEntity } from '../base.entity';

// global variable used
const Status = global.Status;

export class BrandEntityV1 extends BaseEntity {
    constructor() {
        super("Brand");
    }

    async getBrands() {
        try {

            let options = {};

            return await this.getMultipleMdb({ status: Status.ACTIVE }, {}, options);
        } catch(e) {
            throw e;
        }
    }

    async getBrandsWithProducts() {
        try {

            let options = {};

            let criteria = { status: Status.ACTIVE };

            console.log("brands---------");

            return await this.aggregateMdb([
                {$match: criteria}, 
                {
                    $lookup: {
                        from: "products",
                        localField: "name",
                        foreignField: "brand",
                        as: "products"
                }},
                {$unwind: "$products"},
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

export const brandEntityV1 = new BrandEntityV1();