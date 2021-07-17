// dependencies
import { IMiddleware } from 'koa-router';
import * as Compose from 'koa-compose';
import * as Logger from 'koa-logger';
import * as Cors from '@koa/cors';
import * as serve from 'koa-static';
import * as BodyParser from 'koa-bodyparser';
import * as path from "path";

// local dependencies
import auth from './auth';
import basicAuth from './basic.auth';

// required middlewares 
export default function middleware() {
    return Compose([
        Cors(),
        Logger(),
        serve('./uploads'),
        BodyParser({ formLimit: '100mb', jsonLimit: '100mb' }),
    ])
};

// local middlewares
export * from './joi.validator';

export function getMiddleware(middlewares): IMiddleware[] {
    let temp: IMiddleware[] = []
    if (middlewares.indexOf("auth") !== -1)
      temp.push(auth());
    if (middlewares.indexOf("basic_auth") != -1)
      temp.push(basicAuth());
    return temp
  }