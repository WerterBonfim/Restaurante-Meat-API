import restify from 'restify';
import jwt from 'jsonwebtoken';
import { environment } from '../common/environment';
import { User } from '../users/users.model';

export const tokenParser: restify.RequestHandler = (req: restify.Request, res: restify.Response, next: restify.Next) => {

    const token = extractToken(req);

    if (!token)
        return next();

    jwt.verify(token, environment.security.apiSecret, applyBearer(req, next));

}

function extractToken(req: restify.Request): string {

    //Authorization: Bearer token

    const authorization = req.header('authorization');
    const parts: string[] = (authorization || '').split(' ');
    if (parts.length === 2 && parts[0].toLowerCase() === 'bearer')
        return parts[1]; // token

    return undefined;

}

function applyBearer(req: restify.Request, next: restify.Next): (error, decoded) => void {

    return (err, decoded) => {

        if (!decoded) {
            next();
            return;
        }

        User.findByEmail(decoded.sub)
            .then(user => {

                if (user)
                    (<any>req).authenticated = user;

                next();

            })
            .catch(next)

    }

}