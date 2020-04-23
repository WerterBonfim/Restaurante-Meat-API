import restify from 'restify';

import { User } from "./users.model";

import { ModelRouter } from "../common/modal-router";
import { authenticate } from '../security/auth.handler';
import { authorize } from '../security/authz.handler';




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
            .then(this.renderAll(res, next, {
                pageSize: this.pageSize,
                url: req.url
            }))
            .catch(next);

    }

    public applayRoutes(app: restify.Server) {

        app.get({ path: `${this.basePath}`, version: '2.0.0' }, [
            authorize('admin'),
            this.findByEmail,
            this.findAll]
        );

        app.get({ path: `${this.basePath}`, version: '1.0.0' }, [authorize('admin'), this.findAll]);

        app.get(`${this.basePath}/:id`, [authorize('admin'), this.validateId, this.findById]);
        app.post(`${this.basePath}`, [this.validateId, this.save]);
        app.put(`${this.basePath}/:id`, [authorize('admin', 'user'), this.validateId, this.replace]);
        app.del(`${this.basePath}/:id`, [authorize('admin'), this.validateId, this.delete]);
        app.patch(`${this.basePath}/:id`, [authorize('admin', 'user'), this.validateId, this.update]);

        app.post(`${this.basePath}/authenticate`, authenticate);

    }

}
export const usersRouter = new UsersRouter();