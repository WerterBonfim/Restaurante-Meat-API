import { Router } from "../common/router";
import { User } from "./users.model";
import { NotFoundError } from 'restify-errors';


class UsersRouter extends Router {

    /**
     *
     */

    constructor() {
        super();
        this.on('beforeRender', document => {

            if (document)
                document.password = undefined;
            //delete document.password;
        })
    }

    public applayRoutes(app: import("restify").Server) {

        app.get('/users', (req, resp, next) => {

            User.find()
                .then(this.render(resp, next))
                .catch(next);

        });


        app.get('/users/:id', (req, res, next) => {

            User.findById(req.params.id)
                .then(this.render(res, next))
                .catch(next);

        });


        app.post('/users', (req, res, next) => {

            let user = new User(req.body);
            user.save()
                .then(this.render(res, next))
                .catch(next);



            //user.save();

        });

        app.put('/users/:id', (req, res, next) => {

            const options = { new: true, runValidators: true }
            User.update({ _id: req.params.id }, req.body, options)
                .exec()
                .then(this.renderResult(res, next))
                .then(() => User.findById(req.params.id))
                .then(this.render(res, next))
                .catch(next);


        });

        app.del('/users/:id', (req, res, next) => {

            User.deleteOne({ _id: req.params.id })
                .exec()
                .then(result => {

                    !!result.n ?
                        res.send(204) :
                        res.send(404);                    
                    
                    return next();

                })
                .catch(next);



        });

        app.patch('/users/:id', (req, respo, next) => {
            const options = { new: true, runValidators: true }
            User.findByIdAndUpdate(req.params.id, req.body, options)
                .then(this.render(respo, next))
                .catch(next);

        });

    }

}
export const usersRouter = new UsersRouter();