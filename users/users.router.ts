import { Router } from "../common/router";
import { User } from "./users.model";

class UsersRouter extends Router {


    public applayRoutes(app: import("restify").Server) {

        app.get('/users', (req, resp, next) => {

            User.find()
                .then(users => {
                    resp.json(users);
                    return next();
                })

        });


        app.get('/users/:id', (req, res, next) => {

            User.findById(req.params.id).then(user => {

                if (!!user) {
                    res.json(user);
                    return next();
                }

                res.send(404);
                return next();

            })

        });


        app.post('/users', (req, resp, next) => {

            let user = new User(req.body);
            user.save()
                .then(x => {
                    x.password = undefined;
                    respo.json(x);
                    return next();
                })


            //user.save();

        });

        app.put('/users/:id', (req, res, next) => {

            User.update({ _id: req.params.id }, req.body, { overwrite: true })
                .exec()
                .then(result => {

                    console.log('resut', result)

                    if (result.n)
                        return User.findById(req.params.id);

                    res.send(404);

                })
                .then(user => {
                    res.json(user)
                    return next();
                })

        });

        app.del('/users', (req, respo, next) => {

        });

    }

}
export const usersRouter = new UsersRouter();