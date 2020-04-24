import fs from 'fs';

import * as restify from 'restify';
import mongoose from 'mongoose';

import { environment as env, environment } from '../common/environment';
import { Router } from '../common/router';
import { mergePatchBodyParser } from './merge-path.parser';
import { handleError } from './error.handler';
import { tokenParser } from '../security/token.parser';
import { logger } from '../common/logger';

export class Server {

    public app: restify.Server;

    public initializedDb(): any {

        (<any>mongoose.Promise) = global.Promise;
        return mongoose.connect(env.db.url, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
    }

    public initRoutes(routers: Router[]): Promise<any> {

        return new Promise((resolve, reject) => {

            try {                

                let options: restify.ServerOptions = {
                    name: 'meat-api',
                    version: '1.0.0',
                    log: logger
                };

                if (env.security.enableHTTPS) {
                    options.certificate = fs.readFileSync(env.security.certificate);
                    options.key = fs.readFileSync(env.security.key);
                }

                this.app = restify.createServer(options);

                this.app.pre(restify.plugins.requestLogger({
                    log: logger
                }));

                this.app.use(restify.plugins.bodyParser());
                this.app.use(mergePatchBodyParser);
                this.app.use(tokenParser);

                // Routes
                for (let router of routers)
                    router.applayRoutes(this.app);

                this.app.on('restifyError', handleError);
                this.app.on("after", restify.plugins.auditLogger({
                    log: logger,
                    event: 'after'
                    // printLog: true,
                    // server: this.app                    
                }));

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


    public shutdown(): any {
        return mongoose.disconnect()
            .then(() => this.app.close());
    }

}
