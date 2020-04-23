import mongose, { Query, connection } from 'mongoose';
import { isValidCPF } from '../common/validators';
import * as bcrypt from 'bcrypt';
import { environment as env } from '../common/environment';

export interface User extends mongose.Document {    
    name: string;
    email: string;    
    password: string;
    cpf: string;
    gender: string;
    profiles: string[];    
    matches(password: string): Promise<boolean>;
    hasAny(...profiles: string[]): boolean
}

export interface UserModel extends mongose.Model<User> {
    findByEmail(email: string, projection?: string): Promise<User>;
}

const userSchema = new mongose.Schema({
    name: {
        type: String,
        required: true,
        maxlength: 80,
        minlength: 3
    },
    email: {
        type: String,
        required: true,
        maxlength: 50,
        match: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        unique: true
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    gender: {
        type: String,
        required: true,
        enum: [ 'Male', 'Female' ]
    },
    cpf: {
        type: String,
        required: false,
        validate: {
            validator: isValidCPF,
            message: '{PATH}: Invalid CPF ({VALUE})'
        }
    },
    profiles: {
        type: [String],
        required: false
    }
});

userSchema.statics.findByEmail = function(email: string, projection: string) {
    return this.findOne({email}, projection);
}

userSchema.methods.matches = function(password: string): Promise<boolean> {
    
    return bcrypt.compare(password, this.password)
}

userSchema.methods.hasAny = function(...profiles: string[]): boolean {
    return profiles.some(profile => this.profiles.indexOf(profile) !== -1 );
}

const hasPassword = (obj, next) => {
    
    bcrypt.hash(obj.password, env.security.saltRounds)
    .then(hash => {
        obj.password = hash;
        next();
    })
    .catch(next);


}

const saveMiddleware = function(next){

    let user: User = this as User;

    !user.isModified('password') ?
        next():
        hasPassword(user, next);           


}


const updateMiddleware = function(next){

    let user: Query<User> = this;

    !this.getUpdate().password ?
        next() :    
        hasPassword(user.getUpdate(), next);


}

userSchema.pre('save', saveMiddleware);
userSchema.pre('findOneAndUpdate', updateMiddleware);
userSchema.pre('update', updateMiddleware);

export const User = mongose.model<User, UserModel>('User', userSchema);