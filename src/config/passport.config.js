import passport from "passport";
import gitHub from 'passport-github2';
import google from 'passport-google-oauth20';
import jwt from 'passport-jwt';
import jwtConfig from "./jwt.config.js";
import { githubConfig, googleConfig } from "./auth.config.js";
import cookieExtractor from "../utils/cookieExtractor.utils.js";
import { getUserByEmail, getUserByQuery, createUser } from "../users/service.users.js";

const { jwt_secret } = jwtConfig;
const { github_client_Id, github_client_Secret, github_callback_URL } = githubConfig;
const { google_client_Id, google_client_Secret, google_callback_URL } = googleConfig;

const JWTStrategy = jwt.Strategy;
const ExtractJWT = jwt.ExtractJwt;
const GitHubStrategy = gitHub.Strategy;
const GoogleStrategy = google.Strategy;

const initializePassport = () => {
    passport.use('jwt', new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
        secretOrKey: jwt_secret
    }, async (jwt_payload, done) => {
        try {
            return done(null, jwt_payload);
        } catch(error) {
            return done(error);
        }
    }))

    passport.use('github', new GitHubStrategy({
        clientID: github_client_Id,
        clientSecret: github_client_Secret,
        callbackURL: github_callback_URL
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            const data = await getUserByEmail(profile._json.email);
            if(Object.keys(data.payload).length === 0) {

                const newUser = {
                    first_name: profile._json.name,
                    last_name: '',
                    age: '',
                    profile_picture: profile._json.avatar_url,
                    email: profile._json.email,
                    password: '',
                };

                const result = await createUser(newUser)
                const payload = result.payload
                return done(null, payload);
            };

            const user = data.payload;
            return done(null, user);
        } catch(error) {
            return done(error);
        }
    }));

    passport.use('google', new GoogleStrategy({
        clientID: google_client_Id,
        clientSecret: google_client_Secret,
        callbackURL: google_callback_URL
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            const data = await getUserByQuery({ googleId: profile.id});
            if(Object.keys(data.payload).length === 0) {
                const newUser = {
                    googleId: profile.id,
                    first_name: profile._json.given_name,
                    last_name: profile._json.family_name,
                    age: '',
                    profile_picture: profile._json.picture,
                    email: '',
                    password: '',
                };

                const result = await createUser(newUser)
                const payload = result.payload
                return done(null, payload);
            };

            const user = data.payload;
            return done(null, user);
        } catch(error) {
            return done(error);
        }
    }));
};

export default initializePassport;