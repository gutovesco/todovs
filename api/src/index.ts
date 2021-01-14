import 'reflect-metadata';
require("dotenv-safe").config();
import express from "express";
import { createConnection } from 'typeorm';
import { __prod__ } from './constants';
import { join } from 'path';
import { Strategy as GitHubStrategy } from 'passport-github';
import passport from 'passport';

(async () => {
    try {
        await createConnection({
            type: 'postgres',
            database: 'postgres',
            entities: [join(__dirname, './entities/*.*')],
            logging: !__prod__,
            synchronize: !__prod__,
            port: 5666,
            username: 'postgres',
            password: 'guto12+34'
        });
    } catch (err) {
        console.log(err);
    }

    const app = express();
    passport.serializeUser((user: any, done) => {
        done(null, user.accessToken);
    });
    app.use(passport.initialize());

    passport.use(new GitHubStrategy({
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: "http://localhost:3006/auth/github/callback"
    },
        (_, __, profile, cb) => {
            console.log(profile);
            cb(null, { accessToken: 'd5a76w4d65awd5w', refreshToken: 'dawdkawodjawd7d6' });
        }
    ));

    app.get('/auth/github', passport.authenticate('github', { session: false }));

    app.get('/auth/github/callback',
        passport.authenticate('github', { session: false }),
        (_, res) => {
            res.send('successfull login');
        });

    app.listen(3006, () => {
        app.get('/', (_, res) => {
            res.send("hello");
        });
        console.log('listening on 3006!');
    });
})();