"use strict";

const vars = require('../vars');
const gitlab = require('gitlab') ({
    url: vars.GITLAB_HOST,
    token: vars.GITLAB_SECRET
});

function getUser(name) {
    return new Promise((resolve, reject)=>{
        gitlab.users.search(name, (res)=>{
            if (typeof res !== 'undefined' && res.length > 0){
                let found = false;
                for (let i = 0; i < res.length; i++) {
                    if (res[i].username === name) {
                        found = true;
                        resolve(res[i]);
                    }
                }
                // a full list, but no exact matches found
                if(!found) {
                    resolve([]);
                }
            } else {
                // Something went wrong
                // If it's falsey, there was an error.
                if (!res) {
                    reject("Operation did not complete successfully");
                } else {
                    // Otherwise, the list was empty. No results.
                    resolve([]);
                }
            }
        })
    });

}


module.exports = {
    getUser
};