import { usersRouter } from "../users/users.router";
import { Router } from "./router";
import { restaurantsRouter } from "../restaurants/restaurants.router";
import { reviewsRouter } from "../reviews/reviews.router";

export const listOfRouters: Router[] = [

    usersRouter,
    restaurantsRouter,
    reviewsRouter
    

];