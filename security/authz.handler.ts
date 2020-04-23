import restify from 'restify';
import { ForbiddenError } from 'restify-errors';

export const authorize: (...profiles: string[]) => restify.RequestHandler = (...profiles) => {

    return (req: any, res: restify.Response, next: restify.Next) => {

        if (!req.authenticated || !req.authenticated.hasAny(...profiles)) {
            next(new ForbiddenError('Permission denied'));
            return;
        }

        next(true);


    }
}