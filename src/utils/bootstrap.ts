"use strict";

// local dependencies
import { Mongo } from '../mongo';

// global variables boot strap
global.Status = {
    ACTIVE: "ACTIVE",
    INACTIVE: "INACTIVE"
};

global.Gender = [{
    "id": "men"
},
{
    "id": "boys"
},
{
    "id": "girls"
},
{
    "id": "women"
}];

global.Price = [
    {
        "name": "99.0 TO 53994.0"
    },
    {
        "name": "53994.0 TO 107939.0"
    },
    {
        "name": "107939.0 TO 161884.0"
    },
    {
        "name": "161884.0 TO 215829.0"
    }
]

export let bootstrap = async (server) => {
    try {
        await Mongo.init();

        return {};
    } catch (e) {
        throw e;
    }
}
