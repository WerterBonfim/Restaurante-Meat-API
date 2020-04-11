import * as restify from 'restify';
import mongoose from 'mongoose';

import { environment as env } from '../common/environment';
import { Router } from '../common/router';

export class Server {

    application: restify.Server;

    initializedDb(): any {

        (<any>mongoose.Promise) = global.Promise;
        return mongoose.connect(env.db.url, {
            useNewUrlParser: true            
        });
    }

    public initRoutes(routers: Router[]): Promise<any> {

        return new Promise((resolve, reject) => {

            try {

                this.application = restify.createServer({
                    name: 'meat-api',
                    version: '1.0.0'
                });

                this.application.use(restify.plugins.queryParser());
                this.application.use(restify.plugins.bodyParser());

                this.application.listen(env.server.port, () => {
                    resolve(this.application);
                });

                // Routes

                for (let router of routers)
                    router.applayRoutes(this.application);

                this.application.get('/hello', (req, resp, next) => {

                    resp.json({ message: 'hello' });
                    return next();

                });


            } catch (error) {
                reject(error)
            }



        })
    }

    bootstrap(routers: Router[] = []): Promise<Server> {

        return this.initializedDb()
            .then(
                () => this.initRoutes(routers).then(() => this)
            );


    }

}
