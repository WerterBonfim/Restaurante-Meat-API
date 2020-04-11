import { Server } from './server/server';
import { usersRouter } from './users/users.router';

const server = new Server();

server.bootstrap([usersRouter])
.then( server =>{
    console.log('Serer is listening on:', server.application.address())
})
.catch( erro => {
    console.log('Server failed to start');
    console.error(erro);
    process.exit(1);
})




