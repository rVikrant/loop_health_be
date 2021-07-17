"use strict";

import * as mongoose from "mongoose";
import * as Services from '../mongo/dao';

export class BaseService {
    public ObjectId = mongoose.Types.ObjectId;
    public DAOManager = new Services.DAOManager();
    public set: SetNames;
    constructor(set) {
        this.set = set
    }

    async createOneEntityMdb(saveData: Object) {
        try {
            let data = await this.DAOManager.saveData(this.set, saveData)
            return data
        } catch (error) {
            console.log(__filename, 'Base entity createOneEntityMdb', error, false)
            return Promise.reject(error)
        }
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

    async distinctMdb(path: string, criteria: Object) {
        try {
            return await this.DAOManager.distinct(this.set, path, criteria)
        } catch (error) {
            return Promise.reject(error)
        }
    };

    async updateOneEntityMdb(criteria: Object, dataToUpdate: Object, option?) {
        try {
            if (option == undefined)
                option = { new: true, lean: true }
            let data = await this.DAOManager.findAndUpdate(this.set, criteria, dataToUpdate, option)
            return data
        } catch (error) {
            console.log(__filename, 'Base entity updateOneEntityMdb', error, false)
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

    async bulkUpdate(payload) {
        try {
            let bulk = await this.DAOManager.bulkUpdate(this.set, payload);
            return bulk
        } catch (error) {
            console.log(__filename, 'Base entity bulk update', error, false)
            return Promise.reject(error)
        }
    }

    async removeOneEntity(criteria: object) {
        try {
            let data = await this.DAOManager.findAndRemove(this.set, criteria, {});
            return data
        } catch (error) {
            console.log(__filename, 'Base entity bulk update', error, false)
            return Promise.reject(error)
        }
    }
}