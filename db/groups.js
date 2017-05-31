"use strict";

const vars = require('../vars');


const knex = require('knex')({
    client: 'pg',
    connection: {
        database: "mmai",
        host: vars.DB_HOST,
        password: vars.DB_PASS,
        port: vars.DB_PORT,
        user: vars.DB_USER
    }
});


function getGroup(groupName) {
    return new Promise((resolve, reject)=>{
        knex.select('name').from('team').where({ name: groupName }).then((res)=>{ //
            resolve(res);
        }).catch((err)=>{ //
            reject(err);
        });
    });
}


function addMember(groupPath, userId, permissionLevel) {
    return new Promise((resolve, reject)=>{
        // Grab the old members list

        // Create a members list where the new member is added

        // Go ahead and modify the DB to include the new member

    })
}

function insertGroup(groupId) {
    return new Promise((resolve, reject)=>{
        knex('team').insert({
            id : groupId,
        }).then(()=>{ // On success
            resolve("successful");
        }).catch((err)=>{ // On failure
            reject(err);
        });
    });

}

// getGroup("test2").then((res)=>{
//     console.log(res);
// }).catch((err)=>{
//     console.log(err)
// });

module.exports = ({
    getGroup,
    insertGroup
});
