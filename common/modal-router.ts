import mongoose, { Types } from 'mongoose';
import * as restify from 'restify';

import { Router } from './router';
import { NotFoundError } from 'restify-errors';

export abstract class ModelRouter<D extends mongoose.Document> extends Router {


    protected pageSize: number = 4;

    constructor(
        protected model: mongoose.Model<D>,


    ) {
        super();
        this.basePath = `/${model.collection.name}`;
    }



    protected prepareOne(query: mongoose.DocumentQuery<D, D>): mongoose.DocumentQuery<D, D> {
        return query;
    }

    protected envelope(documento: any): any {
        let resource = Object.assign({ _links: {} }, documento.toJSON());
        resource._links.self = `${this.basePath}/${resource._id}`;
        return resource;
    }


    protected validateId = (req: restify.Request, res: restify.Response, next: restify.Next) => {

        if (!mongoose.isValidObjectId(req.params.id))
            next(new NotFoundError('Document not found'))
        else
            next();
    }

    public findAll = (req: restify.Request, res: restify.Response, next: restify.Next) => {        

        let page = parseInt(req.query._page || 1);
        page = page > 0 ? page : 1;
        const skip = (page - 1) * this.pageSize;

        this.model
            .estimatedDocumentCount({})
            //.count({})
            .exec()
            .then(count => this.model.find()
                .skip(skip)
                .limit(this.pageSize)
                .then(this.renderAll(res, next, { 
                    page, count, pageSize: this.pageSize, url: req.url
                }))
                .catch(next));

    }

    public findById = (req: restify.Request, res: restify.Response, next: restify.Next) => {

        this.prepareOne(this.model.findById(req.params.id))
            .then(this.render(res, next))
            .catch(next);

    }

    public save = (req: restify.Request, res: restify.Response, next: restify.Next) => {

        let documento = new this.model(req.body);
        documento.save()
            .then(this.render(res, next))
            .catch(next);

    }

    public replace = (req: restify.Request, res: restify.Response, next: restify.Next) => {

        const options = { new: true, runValidators: true };

        this.model.update({ _id: req.params.id }, req.body, options)
            .exec()
            .then(this.renderResult(res, next))
            .then(() => this.model.findById(req.params.id))
            .then(this.render(res, next))
            .catch(next);

    }

    public delete = (req: restify.Request, res: restify.Response, next: restify.Next) => {

        this.model.deleteOne({ _id: req.params.id })
            .exec()
            .then(result => {

                !!result.n ?
                    res.send(204) :
                    res.send(404);

                return next();

            })
            .catch(next);

    }

    public update = (req: restify.Request, res: restify.Response, next: restify.Next) => {

        const options = { new: true, runValidators: true }
        this.model.findByIdAndUpdate(req.params.id, req.body, options)
            .then(this.render(res, next))
            .catch(next);

    }


}