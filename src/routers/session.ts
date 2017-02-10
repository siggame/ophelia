import * as express from "express";
import * as session from "express-session";

const router = express.Router();

router.use(session({
  secret: 'SECRET',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }
}));

export { router };
