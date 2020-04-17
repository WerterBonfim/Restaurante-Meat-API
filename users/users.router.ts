import restify from 'restify';

import { User } from "./users.model";

import { ModelRouter } from "../common/modal-router";




class UsersRouter extends ModelRouter<User> {

    constructor() {
        super(User);

        this.on('beforeRender', document => {

            if (document)
                document.password = undefined;
            //delete document.password;
        })
    }

    private findByEmail = (req: restify.Request, res: restify.Response, next: restify.Next): void => {

        if (!req.query.email) {
            return next();
        }

        User
            //.find({ email: req.query.email })
            .findByEmail(req.query.email)
            .then(user => user ? [user] : [])
            .then(this.renderAll(res, next))
            .catch(next);

    }

    public applayRoutes(app: restify.Server) {

        app.get({ path: `${this.basePath}`, version: '2.0.0' }, [this.findByEmail, this.findAll]);
        app.get({ path: `${this.basePath}`, version: '1.0.0' }, this.findAll);

        app.get(`${this.basePath}/:id`, [this.validateId, this.findById]);
        app.post(`${this.basePath}`, [this.validateId, this.save]);
        app.put(`${this.basePath}/:id`, [this.validateId, this.replace]);
        app.del(`${this.basePath}/:id`, [this.validateId, this.delete]);
        app.patch(`${this.basePath}/:id`, [this.validateId, this.update]);

    }

}
export const usersRouter = new UsersRouter();