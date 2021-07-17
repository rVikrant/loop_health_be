"use strict";

// dependencies
import { Schema, Document, Model, model } from 'mongoose';

// global variable used
const Status = global.Status;

// schema
const BrandSchema = new Schema({
    name: { type: String, required: true },

    status: { type: String, enum: Status, default: Status.ACTIVE },
    createdAt: { type: Number, default: Date.now() },
});

const Brand = model<any>(
    "Brand",
    BrandSchema
);
export { Brand };