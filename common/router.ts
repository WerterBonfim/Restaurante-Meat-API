import * as restify from 'restify';
import { EventEmitter } from 'events';
import { NotFoundError } from 'restify-errors';


export abstract class Router extends EventEmitter {

    abstract applayRoutes(applications: restify.Server)

    protected render(response: restify.Response, next: restify.Next): any {

        return (document: any) => {

            if (document){
                this.emit('beforeRender', document);
                response.json(document);
            }
            else
                throw new NotFoundError('Documento não encontrado');

            return next();

        }

    }

    protected renderResult(response: restify.Response, next: restify.Next): any {

        return (result: any) => {

            if (result.n)
                this.emit('beforeRender', result);                            
            else            
                throw new NotFoundError('Documento não encontrado');

            return next();

        }

    }


}