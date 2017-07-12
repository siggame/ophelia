'use strict';

const validate = require('./validate.js');
const sha256 = require('js-sha256');
// TODO: Make env variables file, and provide an example for new devs
const knex = require('knex')({
    client: 'pg',
    connection: {
        host: 'localhost',
        port: '5432',
        user: 'postgres',
        password: 'siggame',
        database: 'postgres'
    }
});

function signup(username, pass, contactName, contactEmail, isEligible) {
    return new Promise((resolve, reject) => {
        if(validate.validate(username, pass)) {
            knex('team').insert({
                name: username,
                contact_name: contactName,
                contact_email: contactEmail,
                password: sha256(pass),
                is_eligible: isEligible
            }).then((res) => {
                console.log("res", res);
                resolve(res);
            }).catch((err) => {
                reject(err)
            });
        } else {
            // TODO: Actual Error Handling
            reject("Username or password incorrect");
        }
    });
}

module.exports = {
    signup: signup,
    createUser: signup,
};