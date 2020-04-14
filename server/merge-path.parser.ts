import * as restify from 'restify';
import { BadRequestError } from 'restify-errors';

const mpContentType = 'application/merge-patch+json';

export const mergePatchBodyParser =
    (req: restify.Request, resp: restify.Response, next: restify.Next) => {

        
        const eUmaRequisicaoParical =
        req.getContentType() === mpContentType && req.method === 'PATCH';
        
        console.log('req content type', eUmaRequisicaoParical)
        if (!eUmaRequisicaoParical)
            return next();


        try {

            req.body = JSON.parse(req.body);
            
            
        } catch (e) {
            return next(new BadRequestError(`Invalid content: ${e.message}`));
        }
        
        return next();
    }