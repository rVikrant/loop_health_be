"use strict";

// dependencies
import { Schema, Document, Model, model } from 'mongoose';

// global variable used
const Status = global.Status;

// schema
const CatSchema = new Schema({
    name: { type: String, required: true },

    //@ts-ignore
    status: { type: String, enum: Status, default: Status.ACTIVE },
    createdAt: { type: Number, default: Date.now() },
});

const Category = model<any>(
    "Category",
    CatSchema
);
export { Category };