"use strict";

const knex = require('knex')({
    client: 'pg',
    connection: {
        host: 'localhost',
        port: '5432',
        user: 'postgres',
        password: '',
        database: 'postgres'
    }
});

function getTeam(teamId) {
    return new Promise((resolve, reject) => {
        knex('teams').where({
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
        knex('teams').where({
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
        knex('teams').where({
            id: teamData.id
        }).update(teamData).then((res) => {
            resolve(res);
        }).catch((err) => {
            reject(err);
        })
    });
}

function createTeam(teamName, email, password, isEligible) {
    return new Promise((resolve, reject) => {
        if (typeof teamName === 'undefined' || teamName !== "" ||
            typeof email === 'undefined' || email !== "" ||
            typeof password === 'undefined' || password !== "" ||
            typeof isEligible === 'undefined' || typeof isEligible !== "boolean" ){
            return reject("All args. must be defined and not empty")
        }
        knex('teams').insert({
            name: teamName, 
            contact_email: email,
            password: password,
            is_eligible: isEligible
        }).then((insertId) => {
           //woo hoo
           return resolve()
        }).catch((err) => {
           return reject(err)
        }) 
    });
}

module.exports = {
    createTeam: createTeam,
    getTeam: getTeam,
    getTeamByName: getTeamByName,
    editTeam: editTeam
};