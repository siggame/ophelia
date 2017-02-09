import * as _ from "lodash";

export const GITLAB_HOST = _.defaultTo(process.env.GITLAB_HOST, "localhost");
export const GITLAB_PORT = _.defaultTo(process.env.GITLAB_PORT, 80);
export const GITLAB_ID = _.defaultTo(process.env.GITLAB_ID, "CLIENT_ID");
export const GITLAB_SECRET = _.defaultTo(process.env.GITLAB_SECRET, "GITLAB_SECRET");
export const PORT = _.defaultTo(process.env.PORT, 3000);