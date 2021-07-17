"use strict";

// dependencies
import { Schema, Document, Model, model } from 'mongoose';

// global variable used
const Status = global.Status;

// schema
const ProductSchema = new Schema({
    brand: { type: String, required: true, index: true},
    category: { type: String, required: true, index: true},
    productName: { type: String, required: true, index: true, unique: true },
    landingPageUrl: { type: String, required: true },
    productId: { type: Number, required: true, index: true, unique: true },
    product: { type: String, required: true },
    rating: { type: Number, default: 0},
    ratingCount: { type: Number, default: 0},
    discount: { type: Number, default: 0},
    searchImage: { type: String, required: true },
    effectiveDiscountPercentageAfterTax: { type: Number, default: 0},
    effectiveDiscountAmountAfterTax: { type: Number, default: 0},
    inventoryInfo: [{
        skuId: { type: Number, required: true},
        label: { type: String, required: true },
        inventory: { type: String, required: true },
        available: { type: Boolean, required: true }
    }],
    sizes: { type: String, required: true },
    images: [{
        view: { type: String, required: true },
        src: { type: String, required: true }
    }],
    gender: { type: String, required: true, index: true},
    primaryColour: { type: String, required: true },
    discountLabel: { type: String },
    discountDisplayLabel: { type: String },
    additionalInfo: { type: String },
    mrp: { type: Number, required: true },
    price: { type: String, required: true, index: true},
    colorVariantAvailable: { type: Boolean, required: true },
    discountType: { type: String },
    catalogDate: { type: Number },
    season: { type: String, required: true },
    year: { type: Number, required: true },
    systemAttributes: [{
        attribute: { type: String, required: true },
        value: { type: String, required: true }
    }],

    status: { type: String, enum: Status, default: Status.ACTIVE, index: true },
    createdAt: { type: Number, default: Date.now() },
});

const Product = model<any>(
    "Product",
    ProductSchema
);
export { Product };