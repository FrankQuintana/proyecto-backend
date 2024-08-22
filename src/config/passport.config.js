import passport from "passport";
import jwt from "passport-jwt";
import local from "passport-local";
import userModel from "../dao/models/user.model.js";

const LocalStrategy = local.Strategy;
const JWTStrategy = jwt.Strategy;
const ExtractJwt = jwt.ExtractJwt;

const initializePassport = () => {

};

export default initializePassport;