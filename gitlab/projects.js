"use strict";

const config = require('../config.json');
const vars = require('../vars');
const gitlab = require('gitlab') ({
    url: vars.GITLAB_HOST,
    token: vars.GITLAB_SECRET
});


function getProject(projectPath) {
    return new Promise((resolve, reject)=> {
        gitlab.projects.search(projectPath, (res) => {
            if (typeof res !== 'undefined' && res.length > 0) {
                let found = false;
                for (let i = 0; i < res.length; i++) {
                    console.log(res[i]);
                    if (res[i].name === projectPath) {
                        found = true;
                        resolve(res[i]);
                    }
                }
                // a full list, but no exact matches found
                if(!found) {
                    resolve([]);
                }
            } else {
                // when it's null or undefined or similar
                if (!res) {
                    reject("Operation did not complete successfully");
                } else { // when it's an empty array
                    resolve([]);
                }
            }
        })
    });
}


function getBaseRepo(projectPath) {
    return new Promise((resolve, reject)=> {
        gitlab.projects.search(projectPath, (res) => {
            if (typeof res !== 'undefined' && res.length > 0) {
                let found = false;
                for (let i = 0; i < res.length; i++) {
                    let longProjectPath = "root/" + projectPath;
                    if (res[i].path_with_namespace === longProjectPath) {
                        // Now check to see if owner exists and if it equals root
                        found = true;
                        resolve(res[i]);
                    }
                }
                // a full list, but no exact matches found
                if(!found) {
                    resolve([]);
                }
            } else {
                // when it's null or undefined or similar
                if (!res) {
                    reject("Operation did not complete successfully");
                } else { // when it's an empty array
                    resolve([]);
                }
            }
        })
    });
}

module.exports = {
    getProject,
    getBaseRepo
};