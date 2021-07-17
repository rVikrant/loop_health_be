"use strict";

// dependencies
import * as Joi from '@hapi/joi';

/**
 * Helper function to validate an object against the provided schema,
 * and to throw a custom error if object is not valid.
 *
 * @param {Object} object The object to be validated.
 * @param {String} label The label to use in the error message.
 * @param {JoiSchema} schema The Joi schema to validate the object against.
 */
async function validateObject(object = {}, label, schema, options) {
    // Skip validation if no schema is provided
    if (schema) {
        schema = Joi.object(schema)
        // Validate the object against the provided schema
        try {
            const value = await schema.validateAsync(object, options)
        } catch (error) {
            // Throw error with custom message if validation failed
            console.log(__filename, "validation error", error.message, false)
            return Promise.reject(error.message)
        }
    }
}

/**
 * Generate a Koa middleware function to validate a request using
 * the provided validation objects.
 *
 * @param {Object} validationObj
 * @param {Object} validationObj.headers The request headers schema
 * @param {Object} validationObj.params The request params schema
 * @param {Object} validationObj.query The request query schema
 * @param {Object} validationObj.body The request body schema
 * @returns A validation middleware function.
 */
export const validate = function (validationObj, options?: Object, enableLog?: boolean | string) {
    // Return a Koa middleware function
    return async (ctx, next) => {
        try {
            if (typeof enableLog !== "undefined")
                logRequestData(ctx, enableLog)

            // Validate each request data object in the Koa context object
            await validateObject(ctx.headers, 'Headers', validationObj.headers, options ? { ...options, allowUnknown: true } : { allowUnknown: true, abortEarly: true })
            await validateObject(ctx.params, 'URL Parameters', validationObj.params, options ? { ...options, abortEarly: true } : { abortEarly: true })
            await validateObject(ctx.query, 'URL Query', validationObj.query, options ? { ...options, abortEarly: true } : { abortEarly: true })

            if (ctx.request.body) {
                await validateObject(ctx.request.body, 'Request Body', validationObj.body, options ? { ...options, abortEarly: true } : { abortEarly: true })
            }

            return next()
        } catch (error) {
            // If any of the objects fails validation, send an HTTP 400 response.
            throw error;
        }
    }
}

// logs out request data
function logRequestData(ctx, enableLog: boolean | string) {
    if (typeof enableLog === "boolean") {
        console.log(__filename, "Body parameters", JSON.stringify(ctx.request.body), true)
        console.log(__filename, "Query parameters", JSON.stringify(ctx.query), true)
        console.log(__filename, "Path parameters", JSON.stringify(ctx.params), true)
        console.log(__filename, "Headers parameters", JSON.stringify(ctx.headers), true)
    } else {
        let logParams = enableLog.split('');
        if (logParams.includes('b')) console.log(__filename, "Body parameters", JSON.stringify(ctx.request.body), true)
        if (logParams.includes('q')) console.log(__filename, "Query parameters", JSON.stringify(ctx.query), true)
        if (logParams.includes('p')) console.log(__filename, "Path parameters", JSON.stringify(ctx.params), true)
        if (logParams.includes('h')) console.log(__filename, "Headers parameters", JSON.stringify(ctx.headers), true)
    }
}