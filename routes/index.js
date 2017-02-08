var express = require("express");
var router = express.Router();
const util = require("util");

// Database connection
let knex = require("knex")({
    client: "pg",
    connection: {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME
    }
});

/* GET home page. */
router.get("/", function(req, res, next) {
    res.render("index", { title: "Express" });
});

/* Example router to demonstrate some simple queries with knex */
router.get("/examples/knex", function(req, res, next) {
    var message = "";

    // Search for user with name "Alice" in db using SELECT
    knex("user").where({
        name: "Alice"
    }, "*").asCallback((err, rows) => {
        if(err) return res.status(400).send(err);

        // If user with name "Alice" was not found, let's create a row in the user
        // table for Alice
        if(rows.length !== 1) {
            message = "User with name 'Alice' not found.  Creating user.\n\n";

            knex("user").insert({
                name: "Alice",
                username: "alice",
            }, "*").asCallback((err, rows) => {
                if(err) return res.status(400).send(err);

                message += "Created user for Alice\n\n";
                res.status(200).send(message + util.inspect(rows[0], false, null));
            });
        }
        // User with name "Alice" was found
        else {
            message = "Alice exists in the database!\n\n";
            res.status(200).send(message + util.inspect(rows[0], false, null));
        }


    });
});

module.exports = router;
