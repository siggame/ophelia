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


//Test get submission


//This needs to use the teamName to get the team id from teams table. Then use that id to get the submissions by
//using team_id as the key
function getSubmissionByTeamName(teamName) {
    return new Promise((resolve, reject) => {
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



// console.log('a')
// function stuff(stuff) {
//     return new Promise((resolve, reject) => {
//         // Do some code...
//         //If something went well
//         const print = 'c'
//         console.log('b')
//         return resolve(print);
//         if(1 == "1") {
//             return reject()
//         }
//     })
// }
// stuff.then((stuff) => {
//     console.log(stuff)
// }, () => {
//     console.log('total failure')
// }).catch(() => {
//     // SOEIFNSEOIGHSOEIGNSEOIUGBSEOIGbOSEIGBOESIB
// })
// console.log('c')




// function getSubmission(teamID) {
//     return new Promise(resolve, reject) {
//         //...do stuff here
//         //.soieufbsieufbiseubfse
//         knex.select({
//             name: 'team1',
//             contact_email: 'team@123.nowhere',
//             password: 'plaintext_password!',
//             is_eligible: 'true',
//             created_at: Date.now(),
//             updated_at: Date.now()
//         }).then((rows) => {
//             //woo hoo
//             return resolve(rows)
//         }).catch((err) => {
//             return reject(err)
//         })
//
//
//     }
// }

getSubmissionByTeamName('bestteam').then((res) => {
    console.log(res)
}, (err) => {
    console.log('TOTAL FAILURE', err)
}).catch(() => {
});
