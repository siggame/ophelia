"use strict";

const knex = require('knex')({
    client: 'postgres',
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

//Gets the team info by using the teamName that is passed to it
function getSubmissionByTeamName(teamName) {
    return new Promise((resolve, reject) => {
        if(teamName === null || typeof teamName === 'undefined')
            return reject("Value is null or undefined");
        knex.select('*').from('submissions').joinRaw('natural full join teams').where('name',teamName)
            .then((res) => {
                delete res[0]['password'];
                return resolve(res);
        }).catch((err) => {
            return reject(err);
        })
    });
}

function getTeamByName(teamName) {
    return new Promise((resolve, reject) => {
        knex('teams').where({
            name: teamName
        }).then((res) => {
            return resolve(res);
        }).catch((err) => {
            return reject(err);
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
    })
}

module.exports = {
    getTeam: getTeam,
    getTeamByName: getTeamByName,
    editTeam: editTeam,
    getSubmission: getSubmissionByTeamName
};