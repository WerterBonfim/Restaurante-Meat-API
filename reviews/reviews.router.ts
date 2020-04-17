import mongoose from 'mongoose';

import { ModelRouter } from "../common/modal-router";
import { Review } from "./reviews.model";

class ReviewsRouter extends ModelRouter<Review> {
    /**
     *
     */
    constructor() {
        
        super(Review);
        
    }

    
    
    

    applayRoutes(app: import("restify").Server) {

        app.get(`${this.basePath}`, this.findAll);
        app.get(`${this.basePath}/:id`, [this.validateId, this.findById]);
        app.post(`${this.basePath}`, [this.validateId, this.save]);
        // app.put(`${this.basePath}/:id`, [this.validateId, this.replace]);
        // app.del(`${this.basePath}/:id`, [this.validateId, this.delete]);
        // app.patch(`${this.basePath}/:id`, [this.validateId, this.update]);
        
    }

    // public findById = (req: restify.Request, res: restify.Response, next: restify.Next) => {

    //     this.model.findById(req.params.id)
    //         .populate('user', 'name')
    //         .populate('restaurant', 'name')
    //         .then(this.render(res, next))
    //         .catch(next);

    // }
    

    protected prepareOne(query: mongoose.DocumentQuery<Review, Review> ): mongoose.DocumentQuery<Review, Review>  {
        return query
            .populate('user', 'name')
            .populate('restaurant', 'name');
    }

    protected envelope(document: any): any {
        let resource = super.envelope(document);
        const restId = document.restaurant._id ?? document.restaurant;
        resource._links.restaurant = `/restaurants/${restId}`;
        return resource;
    }
}

export const reviewsRouter = new ReviewsRouter();