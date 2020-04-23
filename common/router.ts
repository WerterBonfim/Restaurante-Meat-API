import * as restify from 'restify';
import { EventEmitter } from 'events';
import { NotFoundError } from 'restify-errors';


export abstract class Router extends EventEmitter {

    protected basePath: string;

    /**
     *
     */
    constructor() {
        super();
    }

    abstract applayRoutes(applications: restify.Server);

    // Hypermidia o REST
    protected envelope(document: any): any {
        return document;
    }

    protected envelopeAll(documents: any[], options: any = {}): any {

        let resource: any = this.makePreviousAndNextPage(options);
        resource.items = documents;

        return resource;
    }

    private makePreviousAndNextPage(options: any = {}): any {

        let resource: any = {

            _links: {
                self: ``
            }
        };

        if (options.page) {

            const remaining = options.count - (options.page * options.pageSize) + 1;

            if (remaining > 0)
                resource._links.next = `${this.basePath}?_page=${options.page + 1}`;

            if (options.page > 1)
                resource._links.previous = `${this.basePath}?_page=${options.page - 1}`
        }

        return resource;

    }



    protected render(response: restify.Response, next: restify.Next): any {

        return (document: any) => {

            if (document) {
                this.emit('beforeRender', document);
                response.json(this.envelope(document));
            }
            else
                throw new NotFoundError('Documento não encontrado');

            return next(false);

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

    protected renderAll(response: restify.Response, next: restify.Next, options: any = []) {

        return (documents: any[] = []) => {

            if (documents)
                documents
                    .forEach((doc, index, array) => {
                        this.emit('beforeRender', doc);
                        array[index] = this.envelope(doc);
                    });

            response.json(this.envelopeAll(documents, options));
        }


    }


}