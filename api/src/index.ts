import 'reflect-metadata';
require("dotenv-safe").config();
import express from "express";
import { createConnection } from 'typeorm';
import { __prod__ } from './constants';
import { join } from 'path';
import { Strategy as GitHubStrategy } from 'passport-github';
import passport from 'passport';
import { User } from './entities/User';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import { Todo } from './entities/Todo';
import { isAuth, ReqWithUserId } from './isAuth';

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
    app.use(cors({ origin: '*' }));
    app.use(passport.initialize());
    app.use(express.json());

    passport.use(new GitHubStrategy({
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: "http://localhost:3006/auth/github/callback"
    },
        async (_, __, profile, cb) => {
            let user = await User.findOne({ where: { githubId: profile.id } });
            if (user) {
                user.name = profile.displayName;
                await user.save();
            } else {
                user = await User.create({ name: profile.displayName, githubId: profile.id }).save();
            }
            cb(null, { accessToken: jwt.sign({ userId: user.id }, String(process.env.JWT_SECRET), { expiresIn: "1w" }) });
        }
    ));

    app.get('/auth/github', passport.authenticate('github', { session: false }));

    app.get('/auth/github/callback',
        passport.authenticate('github', { session: false }),
        (req: any, res) => {
            res.redirect(`http://localhost:54321/auth/${req.user.accessToken}`);
        });

    app.post("/todo", isAuth, async (req: any, res) => {
        const todo = await Todo.create({ text: req.body.text, creatorId: req.userId }).save();
        res.send({ todo });
    });

    app.get("/todo", isAuth, async (req: any, res) => {
        const todos = await Todo.find({ where: { creatorId: req.userId }, order: {id: 'DESC'} });

        res.send({todos});
    });

    app.get("/me", async (req, res) => {
        // Bearer 120jdklowqjed021901
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            res.send({ user: null });
            return;
        }

        const token = authHeader.split(" ")[1];
        if (!token) {
            res.send({ user: null });
            return;
        }

        let userId = "";

        try {
            const payload: any = jwt.verify(token, 'dawdwad231dwa9u9dawd123121ijh8dfvdf78');
            userId = payload.userId;
        } catch (err) {
            res.send({ user: null });
            return;
        }

        if (!userId) {
            res.send({ user: null });
            return;
        }

        const user = await User.findOne(userId);

        res.send({ user });
    });

    app.listen(3006, () => {
        app.get('/', (_, res) => {
            res.send("hello");
        });
        console.log('listening on 3006!');
        console.log('updated');
    });
})();