import 'jest';
import request from 'supertest';
import { fakeNewUser, fakeAdminUser } from '../common/test-helpers';


//let address: string = 'http://localhost:3001';
let
    address: string = (<any>global).address;


describe('Testing APIs of users as administrator', () => {

    describe('shoud be insert user first', () => {

        test('post /user', () => {

            return request(address)
                .post('/users')
                .send(fakeAdminUser)
                .then(response => {

                    expect(response.status).toBe(200);
                    expect(response.body._id).toBeDefined();
                    expect(response.body.name).toBe(fakeAdminUser.name);
                    expect(response.body.email).toBe(fakeAdminUser.email);
                    expect(response.body.cpf).toBe(fakeAdminUser.cpf);
                    expect(response.body.password).toBeUndefined();

                })
                .catch(fail);
        });


    });


    describe('shoud be authenticate', () => {

        test('get /users/authenticate', () => {

            return request(address)
                .post('/users/authenticate')
                .send({
                    "email": fakeAdminUser.email,
                    "password": fakeAdminUser.password
                })
                .then(response => {

                    expect(response.status).toBe(200);
                    expect(response.body.accessToken).not.toBeNull();
                    //console.log('token', response.body.accessToken);

                })
                .catch(fail)

        });

    });

    describe('shoud be user listed', () => {

        test('get /users', () => {

            request(address)
                .post('/users/authenticate')
                .send({
                    "email": fakeAdminUser.email,
                    "password": fakeAdminUser.password
                })
                .then(response => {

                    expect(response.status).toBe(200);
                    expect(response.body.accessToken).not.toBeNull();
                    const token = response.body.accessToken;
                    return token;

                }).then(token => request(address)
                    .get('/users')
                    .auth(token, { type: 'bearer' })
                    //.set('Autorization', `Bearer ${token}`)
                    .then(response => {

                        expect(response.status).toBe(200);
                        expect(response.body.items).toBeInstanceOf(Array);

                    })
                    .catch(fail));


        });

    });




    // test('get /user/aaaa - not found', () => {

    //     return request(address)
    //         .get('/users/aaaa')
    //         .then(response => {

    //             expect(response.status).toBe(404);

    //         })
    //         .catch(fail);
    // });

    // test('patch /users/:id', () => {

    //     return request(address)        
    //         .post('/users')
    //         .send(fakeNewUser)
    //         .then(response => {

    //             request(address)
    //                 .patch(`/users/${response.body._id}`)
    //                 .send({
    //                     name: 'usuario 2 - patch'
    //                 })
    //                 .then(response2 => {

    //                     expect(response2.status).toBe(200);                    
    //                     expect(response2.body.name).toBe('usuario 2 - patch');
    //                     expect(response2.body.email).toBe(fakeNewUser.email);                    
    //                     expect(response2.body.password).toBeUndefined();


    //                 })
    //                 .catch(fail);


    //         })
    //         .catch(fail);
    // });



});




