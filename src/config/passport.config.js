import passport from "passport";
import jwt from "passport-jwt";
import local from "passport-local";
import UserService from "../services/user.service.js";
import { CreateHash, isValidPassword } from "../utils/hashbcrypt.js";
import config from "./config.js";
import userModel from "../dao/models/user.model.js";

const LocalStrategy = local.Strategy;
const JWTStrategy = jwt.Strategy;
const ExtractJwt = jwt.ExtractJwt;

const initializePassport = () => {
    //estrategia de registro
    passport.use("registrer", new LocalStrategy({
        passReqToCallback: true,
        usernameField: "email"
    }, async (req, username, password, done) => {
        const { first_name, last_name, email, age, role } = req.body;
        try {
            let user = await UserService.getUserByEmail(email);
            if (user) return done(null, false, { message: "Usuario ya existe "});

            const newUser = await UserService.registerUser({
                first_name,
                last_name,
                email,
                password,
                age,
                role
            });
            return done (null, newUser);
        } catch (error) {
            return done(error);
        };
    }));

    // estrategia de login
    passport.use("login", new LocalStrategy({
        usernameField: "email"
    }, async (email, password, done) => {
        try {
            const user = await UserService.loginUser(email, password);
            if (!user) {
                return done(null, false, {message: "usuario o contrasena incoreccto"});
            };
            return done(null, user);
        } catch (error) {
            return done(error);
        };
    }));

    //serializacion del usuario guarda solo id en sesion
    passport.serializeUser((user, done) => {
        //serializa el id del usuario
        done(null, user._id.toString());
    });

    //deserializacion del usuario recuperar el usuario completo a partir del id
    passport.deserializeUser(async (id, done) => {
        try {
            const user = await UserService.getUserById(id);
            if (!user) {
                return done(null, false);
            };
            done(null, user);
        } catch (error) {
            done(error);
        };
    });
};

export default initializePassport;