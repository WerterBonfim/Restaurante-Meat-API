import { Server } from './server/server';
import { listOfRouters } from './common/list-of-routers';

const server = new Server();

server.bootstrap(listOfRouters)
.then( server =>{
    console.log('Serer is listening on:', server.app.address())
})
.catch( erro => {
    console.log('Server failed to start');
    console.error(erro);
    process.exit(1);
})




