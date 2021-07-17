"use strict";

import * as mongoose from "mongoose";
import * as Services from '../mongo/dao';

export class BaseEntity {
    public ObjectId = mongoose.Types.ObjectId;
    public DAOManager = new Services.DAOManager();
    public set: SetNames;
    constructor(set) {
        this.set = set
    }

    async getOneEntityMdb(criteria: Object, projection: Object, option?) {
        try {
            if (option != undefined) {
                option['lean'] = true
            } else {
                option = { lean: true }
            }
            let data = await this.DAOManager.findOne(this.set, criteria, projection, option)
            return data
        } catch (error) {
            console.log(__filename, 'Base entity getOneEntityMdb', error, false)
            return Promise.reject(error)
        }
    }

    async getMultipleMdb(criteria: Object, projection: Object, option?) {
        try {
            if (option == undefined)
                option = { lean: true }
            let data = await this.DAOManager.getData(this.set, criteria, projection, option)
            return data
        } catch (error) {
            console.log(__filename, 'Base entity getMultipleMdb', error, false)
            return Promise.reject(error)
        }
    }

    async aggregateMdb(pipeline, option?) {
        try {
            if (option == undefined)
                option = { lean: true }
            let data = await this.DAOManager.aggregateData(this.set, pipeline, option)
            return data
        } catch (error) {
            console.log(__filename, 'Base entity aggregateMdb', error, false)
            return Promise.reject(error)
        }
    }

    async countMdb(criteria: Object) {
        try {
            let data = await this.DAOManager.count(this.set, criteria)
            return data
        } catch (error) {
            console.log(__filename, 'Base entity count', error, false)
            return Promise.reject(error)
        }
    }
}

