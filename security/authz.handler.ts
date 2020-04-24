import restify from 'restify';
import { ForbiddenError } from 'restify-errors';

export const authorize: (...profiles: string[]) => restify.RequestHandler = (...profiles) => {

     function notAuthenticateLogger(req: any): void {

        console.log('valor de req.authenticated', req.authenticated)

        if (!req.authenticated)
            req.authenticated = { _id: undefined, profiles: undefined };

        req.log.debug(`User %s is authorized with profiles %j on route %s. Required profiles %j`,
            req.authenticated._id,
            req.authenticated.profiles,
            req.path(),
            profiles);

     }

     function authenticateLogger(req: any): void {        

        req.log.debug(`Permission denied for %s. Required profiles: %j. User profiles: %j`,
        req.authenticated._id, 
        profiles, 
        req.authenticated.profiles);

     }



    return (req: any , res: restify.Response, next: restify.Next) => {

        if (!req.authenticated || !req.authenticated.hasAny(...profiles)) {
            notAuthenticateLogger(req);
            next(new ForbiddenError('Permission denied'));
            return;
        }        
        
        authenticateLogger(req);
        next(true);


    }
}