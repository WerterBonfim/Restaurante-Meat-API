import * as restify from 'restify'

const buildFriendlyErros = (err: any): any => {

    err.statusCode = 400;
    let messages: any[] = [];
    for (let name in err.errors)
        messages.push({ message: err.errors[name].message});
    
    return {
        errors: messages
    };

    

}

export const handleError = (req: restify.Request, res: restify.Response, err: any, cb: any) => {

    console.log('erros', err)

    err.toJSON = () => {
        return {
            message: err.message
        }
    };


    switch (err.name) {
        
        case 'MongoError':
            if (err.code === 11000)
                err.statusCode = 400;                        
            break;

        case 'ValidationError':
            err.toJSON = () => buildFriendlyErros(err);
            break;
    
        default:
            break;
    }


    return cb();

}