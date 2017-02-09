import * as express from "express";
import * as qs from "querystring";

const router = express.Router();

router.use("/", (req, res, next)=>{
    console.log(`Request: ${req.method} - ${req.path} ?${qs.stringify(req.query)}`);
    next();
});

export { router };
