import restify from "restify";
import * as jwt from 'jsonwebtoken';

import { User } from "../users/users.model";
import { NotAuthorizedError } from "restify-errors";
import { environment as env } from "../common/environment";

export const authenticate: restify.RequestHandler = (req: restify.Request, res: restify.Response, next: restify.Next) => {

    const { email, password } = req.body;
    User.findByEmail(email, '+password')
        .then(user => user.matches(password).then(userFound => userFound ? user : undefined))
        .then(user => {            
            
            if (!user)
                return next(new NotAuthorizedError('Invalid Credentials'));

            // gerar token
            const token = jwt.sign({ sub: user.email, iss: 'meat-api' }, env.security.apiSecret);

            res.json({ name: user.name, email: user.email, accessToken: token });
            return next(false);

        })
        .catch(next)

}