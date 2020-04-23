import * as jestCli from 'jest-cli'

import { environment as env } from "./common/environment";
import { Server } from "./server/server";
import { listOfRouters } from "./common/list-of-routers";

import { User } from "./users/users.model";
import { Review } from "./reviews/reviews.model";
import { Restaurant } from "./restaurants/restaurants.model";

let server: Server

const beforeAllTests = (): Promise<any> => {

    env.db.url = process.env.DB_URL || 'mongodb://localhost/meat-api-test-db';
    env.server.port = process.env.SERVER_PORT || 3001;
    env.logErros = false;
    env.security.enableHTTPS = false;

    //address = `localhost:${env.server.port}`
    server = new Server();
    return server.bootstrap(listOfRouters)
        .then(() => User.remove({}).exec())
        .then(() => Review.remove({}).exec())
        .then(() => Restaurant.remove({}).exec())
        .catch(console.error)

}

const afterAllTests = (): Promise<any> => server.shutdown();


beforeAllTests()
    .then(() => jestCli.run())
    .then(() => afterAllTests())
    .catch(console.error)