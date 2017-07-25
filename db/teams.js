"use strict";

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

function getTeam(teamId) {
    return new Promise((resolve, reject) => {
        knex('team').where({
            id: teamId
        }).then((res)=>{
            resolve(res);
        }).catch((err)=>{
            reject(err);
        })
    });
}

module.exports = {
    getTeam: getTeam
};