// required dependencies
import * as Koa from "koa";
import * as Router from "koa-router";

// local requirements
import { bootstrap } from './utils/bootstrap';
import middleware from './middlewares';
import route from './routes';

const app = new Koa();

//Middleware
app.use(middleware());
app.use(route());
app.proxy = true;

export const start = (async () => {
    try {
      const port = process.env.port;
      
      const server = app.listen(port);
  
      process.on('unhandledRejection', (reason, promise) => {
        console.log(`${process.env.service_name} unhandled rejection due to : `, promise, 'reason:', reason);
      });
  
      await bootstrap(server);

      //@ts-ignore
      console.log("running on port", port, JSON.stringify(Price), JSON.stringify(Gender));
  
    } catch (error) {
      console.error(error)
    }
  })()
