import * as restify from 'restify';
import mongoose from 'mongoose';

import { environment as env } from '../common/environment';
import { Router } from '../common/router';
import { mergePatchBodyParser } from './merge-path.parser';
import { handleError } from './error.handler';

export class Server {

    public app: restify.Server;

    public initializedDb(): any {

        (<any>mongoose.Promise) = global.Promise;
        return mongoose.connect(env.db.url, {
            useNewUrlParser: true
        });
    }

    public initRoutes(routers: Router[]): Promise<any> {

        return new Promise((resolve, reject) => {

            try {

                this.app = restify.createServer({
                    name: 'meat-api',
                    version: '1.0.0'
                });

                this.app.use(restify.plugins.queryParser());
                this.app.use(restify.plugins.bodyParser());
                this.app.use(mergePatchBodyParser);

                // Routes
                for (let router of routers)
                    router.applayRoutes(this.app);

                this.app.on('restifyError', handleError);

                this.app.listen(env.server.port, () => {
                    resolve(this.app);
                });



            } catch (error) {
                reject(error)
            }



        })
    }

    public bootstrap(routers: Router[] = []): Promise<Server> {

        return this.initializedDb()
            .then(
                () => this.initRoutes(routers).then(() => this)
            );


    }

}
