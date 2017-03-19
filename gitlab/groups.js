"use strict";

const config = require('../config.json');
const request = require('request');
const vars = require('../vars');
const db_groups = require('../db/groups');
const gl_users = require('../gitlab/users');
const gl_projects = require('../gitlab/projects');
const gitlab = require('gitlab') ({
    url: vars.GITLAB_HOST,
    token: vars.GITLAB_SECRET
});


function getGroup(groupPath) {
   return new Promise((resolve, reject)=> {
       gitlab.groups.search(groupPath, (res) => {
           if (typeof res !== 'undefined' && res.length > 0) {
               let found = false;
               for (let i = 0; i < res.length; i++) {
                   if (res[i].name === groupPath) {
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


function createGroup(name, initUser) {
    return new Promise((resolve, reject) => {
        // make the group path, adds competition prefix
        let groupPath = config.competition + "-" + name;
        // check to see if that group name exists
        getGroup(groupPath).then((res) => {
            // check to see if result is empty
            if (typeof res !== 'undefined' && res.length === 0) {
                // if is empty, go ahead

                // make params needed for GitLab group creation
                let params = {
                    name: groupPath,
                    path: groupPath,
                    visibility_level: '0'
                };
                // make group in Gitlab
                gitlab.groups.create(params, (res) => {
                    // if here, create on GitLab was successful
                    // go ahead and put it in the DB

                    // Grab the Team's ID
                    let groupId = res.id;

                    db_groups.insertGroup(groupId).then(() => {
                        // if here, made successfully on DB
                        // go ahead and add the user to the group on Gitlab
                        gl_users.getUser(initUser).then((res) => {
                            // if here, got user successfully
                            // check to see if array is blank
                            if (typeof res !== 'undefined') {
                                // this means array isn't blank
                                // set the user ID
                                let userId = res.id;
                                // add user to the GitLab group
                                gitlab.groups.addMember(groupId, userId, 30, () => {
                                    // member added successfully
                                    resolve(groupId);
                                }, () => {
                                    // if here, member couldn't be added to GitLab Group
                                    reject("Couldn't add member!");
                                })
                            }
                        })
                    }, () => {
                        reject("DBError");
                        // if here, didn't make it to DB. error out
                    }).catch(() => {
                        // catch all errors from the createGroup function
                        reject("General Error");
                    })
                }, () => {
                    // if here, GitLab couldn't make it. error out
                    reject("GitLab Error");
                })
            } else {
                // if it is not empty, be done
                reject("Duplicate Group Name!");
            }
        }).catch(() => {
            // catch some more errors from getGroup
            reject("Couldn't retrieve groups!");
        })
    });
}


function addStarterRepo(groupId, langChoice) {
    // TODO: Make sure there isn't a repo there already - each group should have only 1 repo
    return new Promise((resolve, reject)=>{
        // Look for lang choice repo
        // Lang choices are: cpp, csharp, java, python, etc.
        let repoPath = config.competition + "-" + langChoice;
        // look for the repo
        gl_projects.getBaseRepo(repoPath).then((res)=>{
            // found the project
            let projectId = res.id;
            // create params for the fork
            let params = {
                id: projectId,
                namespace: groupId
            };
            gitlab.projects.fork(params, (forkRes)=>{
                let forkId = forkRes.id;
                // delete the relationship between the original forked repo, tighter control
                // Define options to make the request work
                let reqUrl = vars.GITLAB_HOST + '/api/v4/projects/' + forkId + '/fork';
                let options = {
                    url: reqUrl,
                    headers: {
                        'PRIVATE-TOKEN': vars.GITLAB_SECRET
                    }
                };
                request.delete(options, ()=>{
                    resolve("done!");
                });
            });
                // Make the HTTP Request
        }).catch((err)=>{
            // Couldn't find the project
        });
    });
}


module.exports = {
    getGroup,
    createGroup,
    addStarterRepo
};

