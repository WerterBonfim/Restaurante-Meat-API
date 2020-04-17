import 'jest';
import request from 'supertest';


let address: string = 'http://localhost:3001';


test('get /users', () => {

    return request(address)
        .get('/users')
        .then(response => {

            expect(response.status).toBe(200);
            expect(response.body.items).toBeInstanceOf(Array)

        })
        .catch(fail)

})


test('post /user', () => {

    return request(address)
        .post('/users')
        .send({
            name: 'usuario5',
            email: 'usuario5@email.com',
            cpf: '76819844026',
            gender: 'Male',
            password: '123456789'
        })
        .then(response => {

            expect(response.status).toBe(200);
            expect(response.body._id).toBeDefined();
            expect(response.body.name).toBe('usuario5');
            expect(response.body.email).toBe('usuario5@email.com');
            expect(response.body.cpf).toBe('76819844026');
            expect(response.body.password).toBeUndefined();

        })
        .catch(fail)

});

test('get /user/aaaa - not found', () => {

    return request(address)
        .get('/users/aaaa')
        .then(response => {

            expect(response.status).toBe(404);

        })
        .catch(fail);
});

test('patch /users/:id', () => {

    return request(address)
        .post('/users')
        .send({
            name: 'usuario7',
            email: 'usuario7@email.com',
            cpf: '76819844026',
            gender: 'Male',
            password: '123456789'
        })
        .then(response => {

            request(address)
                .patch(`/users/${response.body._id}`)
                .send({
                    name: 'usuario 2 - patch'
                })
                .then(response2 => {

                    expect(response2.status).toBe(200);                    
                    expect(response2.body.name).toBe('usuario 2 - patch');
                    expect(response2.body.email).toBe('usuario7@email.com');                    
                    expect(response2.body.password).toBeUndefined();


                })
                .catch(fail);


        })
        .catch(fail);
});
