import * as restify from 'restify';


export abstract class Router {
    
    abstract applayRoutes(applications: restify.Server)

}