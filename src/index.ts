import * as dotenv from "dotenv";
dotenv.config();

import * as express from "express";
import * as _ from "lodash";
import * as bodyParser from "body-parser";

import * as routers from "./routers";
import * as vars from "./vars";

const app = express();

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/", routers.log);
app.use("/", routers.web);
app.use("/api", routers.api);

app.listen(vars.PORT, ()=>{
    console.log(`Listening on port ${vars.PORT}...`);
});