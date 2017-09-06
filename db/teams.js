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

function getTeamByName(teamName) {
    return new Promise((resolve, reject) => {
        knex('team').where({
            name: teamName
        }).then((res) => {
            resolve(res);
        }).catch((res) => {
            reject(res);
        })
    });
}

function editTeam(teamData) {
    // TODO: Some sort of checking on teamData
    return new Promise((resolve, reject) => {
        knex('team').where({
            id: teamData.id
        }).update(teamData).then((res) => {
            resolve(res);
        }).catch((err) => {
            reject(err);
        })
    })
}

module.exports = {
    getTeam: getTeam,
    getTeamByName: getTeamByName,
    editTeam: editTeam
};