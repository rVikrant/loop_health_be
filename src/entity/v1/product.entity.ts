
import { BaseEntity } from '../base.entity';
import { brandEntityV1, categoryEntityV1 } from '../index';

import { DEFAULT_LIMIT, DEFAULT_SKIP } from '../../config/constants';

// global Variable used
const Price = global.Price;
const Status = global.Status;

export class ProductEntityV1 extends BaseEntity {
    constructor() {
        super("Product");
    }

    async getProducts(payload: IProductRequestV1.IGetProducts) {
        try {
            let limit = DEFAULT_LIMIT;
            let skip = payload.page > 0 && (payload.page - 1) * limit || DEFAULT_SKIP;

            let options = {
                skip,
                limit,
                sort: {}
            };

            let criteria: any = {
                status: Status.ACTIVE
            };

            if (payload.brand) {
                criteria.brand = payload.brand;
            }

            if (payload.category) {
                criteria.category = payload.category;
            }

            if (payload.search) {
                criteria.productName = new RegExp(payload.search, 'i');
            }

            // if multiply sort options and order is different as aesc or desc then use switch 
            if (payload.sortBy) {
                options.sort[payload.sortBy] = 1;
            } else {
                options.sort["_id"] = -1;  // newly added products first 
            }

            return await Promise.all([
                this.countMdb(criteria),
                this.getMultipleMdb(criteria, {}, options)
            ]);
        } catch (e) {
            throw e;
        }
    }

    async productsGroupedByPrice() {
        try {
            return await this.aggregateMdb([
                {$match: {status: Status.ACTIVE}},
                {$project: {status: 0, __version: 0}},
                {
                    $bucket: {
                        groupBy: "$price",
                        boundaries: [49, 53994, 107939, 161884, 215829],          // calculate it through global Price variable by splitting the values from "to"
                        default: "other",
                        output: {
                            count: { $sum: 1 }
                        }
                    }
                },
                {
                    $project: {
                        count: "$count",
                        id: {
                            $switch: {
                                branches: [
                                    {
                                        case: {$eq: ["$_id", 49]},
                                        then: Price[0].name
                                    },
                                    {
                                        case: {$eq: ["$_id", 53994]},
                                        then: Price[1].name
                                    },
                                    {
                                        case: {$eq: ["$_id", 107939]},
                                        then: Price[2].name
                                    },
                                    {
                                        case: {$eq: ["$_id", 161884]},
                                        then: Price[3].name
                                    },
                                    {
                                        case: {$eq: ["$_id", 215829]},
                                        then: Price[3].name
                                    }
                                ],
                                default: "Other"
                            }
                        },
                        _id: 0
                    }
                }
            ])
        } catch(e) {
            throw e;
        }
    }

    async getProductsWithCompleteData(payload: IProductRequestV1.IGetProducts) {
        try {
            let limit = DEFAULT_LIMIT;
            let skip = payload.page > 0 && (payload.page - 1) * limit || DEFAULT_SKIP;

            let options = {
                skip,
                limit,
                sort: {}
            };

            let criteria: any = {
                status: Status.ACTIVE
            };

            if (payload.brand) {
                criteria.brand = payload.brand;
            }

            if (payload.category) {
                criteria.category = payload.category;
            }

            if (payload.search) {
                criteria.productName = new RegExp(payload.search, 'i');
            }

            // if multiply sort options and order is different as aesc or desc then use switch 
            if (payload.sortBy) {
                options.sort[payload.sortBy] = 1;
            } else {
                options.sort["_id"] = -1;  // newly added products first 
            }

            let pipeline = [
                { $match: criteria },
                {
                    $facet: {
                        count: [{ $count: "count" }],
                        products: [
                            { $sort: options.sort },
                            { $skip: options.skip },
                            { $limit: options.limit }
                        ],
                        productsCountByPrice: [{
                            $bucket: {
                                groupBy: "$price",
                                boundaries: [49, 53994, 107939, 161884, 215829],          // calculate it through global Price variable by splitting the values from "to"
                                default: "other",
                                output: {
                                    count: { $sum: 1 }
                                }
                            }
                        },
                        {
                            $project: {
                                count: "$count",
                                id: {
                                    $switch: {
                                        branches: [
                                            {
                                                case: {$eq: ["$_id", 49]},
                                                then: Price[0].name
                                            },
                                            {
                                                case: {$eq: ["$_id", 53994]},
                                                then: Price[1].name
                                            },
                                            {
                                                case: {$eq: ["$_id", 107939]},
                                                then: Price[2].name
                                            },
                                            {
                                                case: {$eq: ["$_id", 161884]},
                                                then: Price[3].name
                                            },
                                            {
                                                case: {$eq: ["$_id", 215829]},
                                                then: Price[3].name
                                            }
                                        ],
                                        default: "Other"
                                    }
                                },
                                _id: 0
                            }
                        }]
                    }
                },
                {
                    $project: {
                        totalCount: { $arrayElemAt: ["$count.count", 0] },
                        products: 1,
                        productsCountByPrice: 1
                    }
                }
            ];

            return await Promise.all([
                this.aggregateMdb(pipeline),
                brandEntityV1.getBrandsWithProducts(),
                categoryEntityV1.getCategoriesWithProducts()
            ]);
        } catch (e) {
            throw e;
        }
    }
}

export const productEntityV1 = new ProductEntityV1();