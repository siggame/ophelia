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


/**
 * insertUser - inserts a registered user into the Database
 * @param {string} name - Username of the user.
 * @param {string} fullName - User's full (actual) name
 * @param {string} email - Email for the user's account.
 * @param {string} shirtSize - Available options are 's' to 'xxl'.
 * @param pizzaChoice - Available options are 'cheese', 'pepperoni', 'bacon', and 'chicken'.
 * @param isStudent - Defaults to True in the DB, but can be set False.
 * @returns {Promise} - async function
 */
function insertUser(name, fullName, email, shirtSize, pizzaChoice, isStudent) {
    return new Promise((resolve, reject)=>{
        knex('user').insert({
            name: name,
            full_name: fullName,
            email: email,
            shirt_size: shirtSize,
            pizza_choice: pizzaChoice,
            is_student: isStudent
        }).then(()=>{ // On success
            resolve("successful");
        }).catch((err)=>{ // On failure
            reject(err);
        });
    });

}


/**
 * updateUser - updates the information of a user specified by username
 * @param name - the username of the target
 * @param changes - a map containing the desired changes. Possible values are: name, full_name, email, is_dev (bool),
 * is_student (bool), is_sponsor (bool), is_prev_competitor (bool), shirt_size (s, m, l, xl, xxl), pizza choice (cheese,
 * pepperoni, bacon, chicken)
 * @returns {Promise} - async function
 */
function updateUser(name, changes) {
    return new Promise((resolve, reject)=>{
        knex('user').where({ name: name }).update(changes, "*").then(()=>{
            resolve("updated successfully");
    }).catch((err)=> {
            reject(err);
        });
    });
}


/**
 * deleteUser - deletes a user from the database based on a given username
 * @param name - username of the desired target
 * @returns {Promise} - async function
 */
function deleteUser(name) {
    return new Promise((resolve, reject)=>{
        knex('user').where({
            name: name
        }).del().then(()=>{
            resolve(name + " successfully deleted");
        }).catch((err)=>{
            reject(err);
        });
    });
}


module.exports = {
    insertUser,
    updateUser,
    deleteUser
};
