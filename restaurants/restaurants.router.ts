import { ModelRouter } from "../common/modal-router";
import { Restaurant } from "./restaurants.model";
import * as restify from 'restify';
import { NotFoundError } from "restify-errors";



class RestaurantsRouter extends ModelRouter<Restaurant> {

    /**
     *
     */
    constructor() {
        super(Restaurant);
    }

    public envelope(document: any): any {

        let resource = super.envelope(document);
        resource._links.menu = `${this.basePath}/${resource._id}/menu`;
        return resource;

    }

    public findMenu(req: restify.Request, resp: restify.Response, next: restify.Next): void {

        Restaurant.findById(req.params.id, "+menu")
            .then(rest => {

                if (!rest)
                    throw new NotFoundError('Restaurant not found')

                resp.json(rest.menu);
                return next();

            })
            .catch(next);

    }

    public replaceMenu(req: restify.Request, resp: restify.Response, next: restify.Next): any {

        Restaurant.findById(req.params.id)
            .then(rest => {

                if (!rest)
                    throw new NotFoundError('Restaurant not found')

                rest.menu = req.body; // ARRAY de MenuItem
                return rest.save();

            })
            .then(rest => {
                resp.json(rest.menu);
                return next();
            })
            .catch(next);

    }

    public applayRoutes(app: import("restify").Server) {
        
        app.get(`${this.basePath}`, this.findAll);
        app.get(`${this.basePath}/:id`, [this.validateId, this.findById]);
        app.post(`${this.basePath}`, [this.validateId, this.save]);
        app.put(`${this.basePath}/:id`, [this.validateId, this.replace]);
        app.del(`${this.basePath}/:id`, [this.validateId, this.delete]);
        app.patch(`${this.basePath}/:id`, [this.validateId, this.update]);

        app.get(`${this.basePath}/:id/menu`, [this.validateId, this.findMenu]);
        app.put(`${this.basePath}/:id/menu`, [this.validateId, this.replaceMenu]);

    }


}

export const restaurantsRouter = new RestaurantsRouter();