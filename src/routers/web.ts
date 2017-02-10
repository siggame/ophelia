import * as express from "express";
import { needsAuthentication } from "./auth";
const router = express.Router();

router.get("/", (req, res)=>{
    res.send("Done");
});

router.get("/dashboard", needsAuthentication, (req,res)=>{
    res.send("authed")
});

export { router };