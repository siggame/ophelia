import * as express from "express";
import * as session from "express-session";
import * as vars from "../vars";
import * as request from "request";
import * as qs from "querystring";

const router = express.Router();

router.use(session({
  secret: 'SECRET',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }
}));

router.use("/", (req: any, res, next)=>{
    if(req.session.gitlab_token == null) {
        const qstr = qs.stringify({
            client_id: vars.GITLAB_ID,
            redirect_uri: "http://localhost:3000/done",
            response_type: "code"
        });
        const url = `http://${vars.GITLAB_HOST}:${vars.GITLAB_PORT}/oauth/authorize?${qstr}`;
        return res.redirect(url);
    }

    next();
});

router.get("/auth", (req, res)=>{
    const code = req.query.code;
    const qstr = qs.stringify({
        client_id: vars.GITLAB_ID,
        client_secret: vars.GITLAB_SECRET,
        grant_type: "authorization_code",

        redirect_uri: "http://localhost:3000/done",
        response_type: "code"
    });
    const url = `http://${vars.GITLAB_HOST}:${vars.GITLAB_PORT}/oauth/token?${qstr}`;
    request.post()

});

router.get("/done", (req, res)=>{
    res.send("done");
});

router.get("/", (req, res)=>{

});

export { router as web };