import mongose from 'mongoose';

export interface User extends mongose.Document {
    name: string;
    email: string;
    password: string;
}

const userSchema = new mongose.Schema({
    name: {
        type: String
    },
    email: {
        type: String,
        unique: true 
    },
    password: {
        type: String,
        select: false
    }
});

export const User = mongose.model<User>('User', userSchema);